/**
 * Product Model
 * Mongoose schema for products
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [2, 'Product name must be at least 2 characters'],
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    compareAtPrice: {
        type: Number,
        min: [0, 'Compare at price cannot be negative'],
        default: null
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    subcategory: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    sku: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    attributes: [{
        name: {
            type: String,
            trim: true
        },
        value: {
            type: String,
            trim: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    ratings: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
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

// Indexes for common queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function() {
    return this.stock > 0;
});

// Method to decrease stock
productSchema.methods.decreaseStock = async function(quantity) {
    if (this.stock < quantity) {
        throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
    return await this.save();
};

// Static method to find active products
productSchema.statics.findActive = function() {
    return this.find({ isActive: true });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
