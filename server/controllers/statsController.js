const User = require('../models/User');
const Product = require('../models/Product');
const Contact = require('../models/Contact');

// @desc    Get dashboard stats
// @route   GET /api/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalProducts = await Product.countDocuments();
    const totalContacts = await Contact.countDocuments();

    // Bar Chart Data: Products by Category
    const productsByCategory = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

    // Pie Chart Data: Role Distribution
    const roleDistribution = [
      { name: 'Users', value: totalUsers },
      { name: 'Admins', value: totalAdmins }
    ];

    // Line Chart Data: Mocking past 6 months of User Growth
    // (If the app had a lot of data, we would aggregate by createdAt)
    const currentMonth = new Date().getMonth();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      let monthIndex = (currentMonth - i + 12) % 12;
      userGrowth.push({
        name: months[monthIndex],
        users: Math.floor(Math.random() * 50) + 10 // Simulating dynamic growth
      });
    }

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalAdmins,
          totalProducts,
          totalContacts
        },
        charts: {
          productsByCategory,
          roleDistribution,
          userGrowth
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
