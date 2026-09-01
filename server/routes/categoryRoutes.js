import express from 'express';

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'For You', icon: 'Sparkles', count: 50000 },
      { id: 'mobiles', name: 'Mobiles', icon: 'Smartphone', count: 7 },
      { id: 'electronics', name: 'Electronics', icon: 'Laptop', count: 8 },
      { id: 'fashion', name: 'Fashion', icon: 'Shirt', count: 7 },
      { id: 'footwear', name: 'Footwear', icon: 'Footprints', count: 5 },
      { id: 'beauty', name: 'Beauty', icon: 'Sparkles', count: 4 },
      { id: 'home', name: 'Home', icon: 'Home', count: 6 },
      { id: 'accessories', name: 'Accessories', icon: 'Watch', count: 5 }
    ];

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single category
router.get('/:id', (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'For You', icon: 'Sparkles', count: 50000 },
      { id: 'mobiles', name: 'Mobiles', icon: 'Smartphone', count: 7 },
      { id: 'electronics', name: 'Electronics', icon: 'Laptop', count: 8 },
      { id: 'fashion', name: 'Fashion', icon: 'Shirt', count: 7 },
      { id: 'footwear', name: 'Footwear', icon: 'Footprints', count: 5 },
      { id: 'beauty', name: 'Beauty', icon: 'Sparkles', count: 4 },
      { id: 'home', name: 'Home', icon: 'Home', count: 6 },
      { id: 'accessories', name: 'Accessories', icon: 'Watch', count: 5 }
    ];

    const category = categories.find(c => c.id === req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create category (Admin)
router.post('/', (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const newCategory = {
      id: 'cat-' + Date.now(),
      name,
      icon: icon || 'Sparkles',
      count: 0
    };

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update category (Admin)
router.put('/:id', (req, res) => {
  try {
    const { name, icon } = req.body;
    const categoryId = req.params.id;

    if (categoryId === 'all') {
      return res.status(400).json({ success: false, message: 'Cannot modify default "For You" category' });
    }

    const updatedCategory = {
      id: categoryId,
      name: name || 'Updated Category',
      icon: icon || 'Sparkles',
      count: 0
    };

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete category (Admin)
router.delete('/:id', (req, res) => {
  try {
    const categoryId = req.params.id;

    if (categoryId === 'all') {
      return res.status(400).json({ success: false, message: 'Cannot delete default "For You" category' });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
