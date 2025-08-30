const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if user is authenticated and is admin
const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get user statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize counts
    const userStats = {
      guides: 0,
      tourists: 0,
      packageProviders: 0,
      admins: 0,
      total: 0
    };

    // Map the aggregation results
    stats.forEach(stat => {
      switch (stat._id) {
        case 'Guide':
          userStats.guides = stat.count;
          break;
        case 'Tourist':
          userStats.tourists = stat.count;
          break;
        case 'PackageProvider':
          userStats.packageProviders = stat.count;
          break;
        case 'Admin':
          userStats.admins = stat.count;
          break;
      }
      userStats.total += stat.count;
    });

    res.json({
      success: true,
      stats: userStats
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user statistics' 
    });
  }
});

// Get all users (for admin management)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role; // Optional role filter
    const search = req.query.search; // Optional search term

    const query = {};
    
    // Role filter
    if (role && role !== 'all') {
      query.role = role;
    }

    // Search filter
    if (search && search.trim() !== '') {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
});

// Generate users report (PDF) - This route must be before the parameterized routes
router.get('/users/report', requireAdmin, async (req, res) => {
  try {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({
      bufferPages: true,
      autoFirstPage: true,
      size: 'A4',
      margin: 50,
      info: {
        Title: 'Users Report',
        Author: 'Tourist Management System',
        Subject: 'User Management Report'
      }
    });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=users-report.pdf');
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Apply same filtering logic as regular users endpoint
    const role = req.query.role; // Optional role filter
    const search = req.query.search; // Optional search term

    const query = {};
    
    // Role filter
    if (role && role !== 'all') {
      query.role = role;
    }

    // Search filter
    if (search && search.trim() !== '') {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get filtered users for report
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    // Get stats for filtered data
    const statsQuery = query && Object.keys(query).length > 0 ? [
      { $match: query },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ] : [
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ];
    
    const stats = await User.aggregate(statsQuery);
    
    const userStats = {
      guides: 0,
      tourists: 0,
      packageProviders: 0,
      admins: 0,
      total: users.length
    };
    
    stats.forEach(stat => {
      switch (stat._id) {
        case 'Guide':
          userStats.guides = stat.count;
          break;
        case 'Tourist':
          userStats.tourists = stat.count;
          break;
        case 'PackageProvider':
          userStats.packageProviders = stat.count;
          break;
        case 'Admin':
          userStats.admins = stat.count;
          break;
      }
    });
    
    // Add content to PDF with attractive styling
    const primaryColor = '#2563eb'; // Blue
    const secondaryColor = '#64748b'; // Gray
    const accentColor = '#10b981'; // Green
    
    // Header section with background color
    doc.rect(0, 0, doc.page.width, 120).fill('#f8fafc');
    
    // Company logo placeholder (you can add actual logo later)
    doc.rect(50, 20, 60, 60).fill(primaryColor);
    doc.fontSize(14).fillColor('white').text('TMS', 65, 45);
    
    // Main title
    doc.fontSize(24).fillColor(primaryColor).text('Tourist Management System', 130, 30);
    doc.fontSize(18).fillColor(secondaryColor).text('Users Report', 130, 60);
    doc.fontSize(12).fillColor('#6b7280').text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 130, 85);
    
    // Statistics section with cards
    let yPos = 150;
    doc.fontSize(18).fillColor(primaryColor).text('User Statistics', 50, yPos);
    
    // Statistics cards
    yPos += 40;
    const cardWidth = 120;
    const cardHeight = 80;
    const cardSpacing = 140;
    
    // Total Users Card
    doc.rect(50, yPos, cardWidth, cardHeight).fill('#eff6ff').stroke(primaryColor);
    doc.fontSize(24).fillColor(primaryColor).text(userStats.total.toString(), 90, yPos + 15);
    doc.fontSize(12).fillColor(secondaryColor).text('Total Users', 70, yPos + 50);
    
    // Guides Card
    doc.rect(50 + cardSpacing, yPos, cardWidth, cardHeight).fill('#f0fdf4').stroke(accentColor);
    doc.fontSize(24).fillColor(accentColor).text(userStats.guides.toString(), 90 + cardSpacing, yPos + 15);
    doc.fontSize(12).fillColor(secondaryColor).text('Guides', 80 + cardSpacing, yPos + 50);
    
    // Tourists Card
    doc.rect(50 + cardSpacing * 2, yPos, cardWidth, cardHeight).fill('#fef3c7').stroke('#f59e0b');
    doc.fontSize(24).fillColor('#f59e0b').text(userStats.tourists.toString(), 90 + cardSpacing * 2, yPos + 15);
    doc.fontSize(12).fillColor(secondaryColor).text('Tourists', 75 + cardSpacing * 2, yPos + 50);
    
    // Package providers Card
    doc.rect(50 + cardSpacing * 3, yPos, cardWidth, cardHeight).fill('#fce7f3').stroke('#ec4899');
    doc.fontSize(24).fillColor('#ec4899').text(userStats.packageProviders.toString(), 90 + cardSpacing * 3, yPos + 15);
    doc.fontSize(12).fillColor(secondaryColor).text('Providers', 70 + cardSpacing * 3, yPos + 50);
    
    // User Details Table
    yPos += 120;
    doc.fontSize(18).fillColor(primaryColor).text('User Details', 50, yPos);
    
    yPos += 40;
    
    // Table header background
    doc.rect(50, yPos, 500, 25).fill('#f1f5f9');
    
    // Table headers with better styling
    doc.fontSize(12).fillColor(primaryColor);
    doc.text('Full Name', 60, yPos + 8);
    doc.text('Email Address', 200, yPos + 8);
    doc.text('Role', 350, yPos + 8);
    doc.text('Join Date', 450, yPos + 8);
    
    yPos += 35;
    
    // Table rows with alternating colors
    users.forEach((user, index) => {
      if (yPos > 720) { // New page if needed
        doc.addPage();
        yPos = 50;
        
        // Repeat header on new page
        doc.rect(50, yPos, 500, 25).fill('#f1f5f9');
        doc.fontSize(12).fillColor(primaryColor);
        doc.text('Full Name', 60, yPos + 8);
        doc.text('Email Address', 200, yPos + 8);
        doc.text('Role', 350, yPos + 8);
        doc.text('Join Date', 450, yPos + 8);
        yPos += 35;
      }
      
      // Alternating row colors
      if (index % 2 === 0) {
        doc.rect(50, yPos - 5, 500, 20).fill('#fafafa');
      }
      
      // Role-based color coding
      let roleColor = secondaryColor;
      switch (user.role) {
        case 'Admin':
          roleColor = '#dc2626'; // Red
          break;
        case 'Guide':
          roleColor = accentColor; // Green
          break;
        case 'Tourist':
          roleColor = '#f59e0b'; // Orange
          break;
        case 'PackageProvider':
          roleColor = '#ec4899'; // Pink
          break;
      }
      
      doc.fontSize(10).fillColor('#374151');
      doc.text(`${user.firstName} ${user.lastName}`, 60, yPos);
      doc.text(user.email, 200, yPos);
      doc.fillColor(roleColor).text(user.role, 350, yPos);
      doc.fillColor('#6b7280').text(new Date(user.createdAt).toLocaleDateString(), 450, yPos);
      
      yPos += 18;
    });
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate report' 
    });
  }
});

// Delete user
router.delete('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Don't allow deleting admin users
    if (user.role === 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot delete admin users' 
      });
    }

    // Don't allow deleting yourself
    if (userId === req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user' 
    });
  }
});

module.exports = router;
