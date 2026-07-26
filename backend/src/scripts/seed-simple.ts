import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// Define Product schema directly in the script
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  images: [String],
  category: String,
  moq: Number,
  specifications: Object,
  features: [String],
  isActive: Boolean,
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

const products = [
  {
    name: 'GI Wire',
    slug: 'gi-wire',
    description: 'High-quality galvanized iron wire for construction and fencing.',
    images: ['https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565630/WhatsApp_Image_2026-06-13_at_23.38.29_xh55bn.jpg'],
    category: 'Wire',
    moq: 500,
    specifications: { Material: 'Galvanized Iron', Gauge: '8-16' },
    features: ['Corrosion Resistant', 'High Tensile Strength', 'Durable'],
    isActive: true
  },
  {
    name: 'Barbed Wire',
    slug: 'barbed-wire',
    description: 'Durable barbed wire for security fencing and boundary protection.',
    images: ['https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/4_ahrycv.jpg'],
    category: 'Fencing',
    moq: 500,
    specifications: { Material: 'Galvanized Steel', BarbSpacing: '10-15 cm' },
    features: ['Sharp Barbs', 'High Security', 'Weather Resistant'],
    isActive: true
  },
  {
    name: 'Chain Link Fencing',
    slug: 'chain-link-fencing',
    description: 'Strong chain link fencing for industrial, residential, and commercial use.',
    images: ['https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/6_w4ss2l.jpg'],
    category: 'Fencing',
    moq: 500,
    specifications: { Material: 'Galvanized Steel', MeshSize: '50-75 mm' },
    features: ['Strong Structure', 'Easy Installation', 'Low Maintenance'],
    isActive: true
  },
  {
    name: 'Wire Mesh',
    slug: 'wire-mesh',
    description: 'Versatile wire mesh for construction, screening, and industrial applications.',
    images: ['https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/7_w4ss2l.jpg'],
    category: 'Mesh',
    moq: 500,
    specifications: { Material: 'Galvanized Steel', MeshSize: '10-100 mm' },
    features: ['Versatile Use', 'Strong', 'Corrosion Resistant'],
    isActive: true
  },
  {
    name: 'Nails',
    slug: 'nails',
    description: 'Premium quality nails for construction, woodworking, and industrial applications.',
    images: ['https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565628/5_x7pdmc.jpg'],
    category: 'Hardware',
    moq: 500,
    specifications: { Material: 'Steel', Length: '25-150 mm' },
    features: ['Strong', 'Durable', 'Rust Resistant'],
    isActive: true
  },
  {
    name: 'Binding Wire',
    slug: 'binding-wire',
    description: 'Flexible binding wire for construction, bundling, and tying applications.',
    images: ['https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565628/3_ohlqkt.jpg'],
    category: 'Wire',
    moq: 500,
    specifications: { Material: 'Steel', Gauge: '8-16' },
    features: ['Flexible', 'Easy to Tie', 'Strong'],
    isActive: true
  }
]

const seed = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('✅ Cleared existing products')

    // Insert products
    const result = await Product.insertMany(products)
    console.log(`✅ Created ${result.length} products`)
    
    result.forEach((p: any) => {
      console.log(`   - ${p.name}`)
    })

    console.log('\n✅ Seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

seed()