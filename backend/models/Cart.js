/**
 * Cart Model
 * Mongoose schema for shopping carts
 */

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
}, {
    _id: false
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    },
    itemCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            return ret;
        }
    }
});

// Pre-save middleware to calculate totals
// Note: Using regular function to access 'this'
cartSchema.pre('save', function(next) {
    this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    next();
});

// Method to add or update item in cart
cartSchema.methods.addItem = async function(productId, quantity, price) {
    const existingItemIndex = this.items.findIndex(
        item => item.product.toString() === productId.toString()
    );

    if (existingItemIndex >= 0) {
        // Update existing item
        this.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        this.items.push({
            product: productId,
            quantity,
            price
        });
    }

    return await this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function(productId) {
    this.items = this.items.filter(
        item => item.product.toString() !== productId.toString()
    );
    return await this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = async function(productId, quantity) {
    const itemIndex = this.items.findIndex(
        item => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
        throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return await this.removeItem(productId);
    }

    this.items[itemIndex].quantity = quantity;
    return await this.save();
};

// Method to clear cart
cartSchema.methods.clear = async function() {
    this.items = [];
    this.total = 0;
    this.itemCount = 0;
    return await this.save();
};

// Static method to find or create cart for user
cartSchema.statics.findOrCreate = async function(userId) {
    let cart = await this.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
        cart = await this.create({ user: userId, items: [] });
    }
    
    return cart;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
