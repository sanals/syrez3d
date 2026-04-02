export interface Product {
  id: string
  name: string
  category: 'toys' | 'materials'
  price: number
  image: string
  description: string
  specs: {
    material: string
    printTime: string
    scale: string
  }
  featured?: boolean
}

export const products: Product[] = [
  {
    id: 'genesis-alpha',
    name: 'Genesis Alpha',
    category: 'toys',
    price: 189,
    image: '/products/genesis-alpha.jpg',
    description: 'A minimalist abstract form that celebrates the precision of 3D printing. Hand-finished matte resin with geometric abstraction.',
    specs: {
      material: 'Matte Resin (SLS)',
      printTime: '8 hours',
      scale: '120mm height'
    },
    featured: true
  },
  {
    id: 'silk-filament-white',
    name: 'Silk Filament Pro - White',
    category: 'materials',
    price: 34,
    image: '/products/silk-filament-white.jpg',
    description: 'Premium 1kg spool of silk-textured filament. Creates ultra-smooth surfaces with minimal post-processing required. Perfect for display pieces.',
    specs: {
      material: 'PLA + Silk Additive',
      printTime: 'Standard PLA speed',
      scale: '1kg spool'
    },
    featured: true
  },
  {
    id: 'void-form-obsidian',
    name: 'Void Form - Obsidian',
    category: 'toys',
    price: 249,
    image: '/products/void-form-obsidian.jpg',
    description: 'A meditation on negative space. Obsidian-black resin with internal voids that catch light. Hand-polished edges.',
    specs: {
      material: 'Technical Resin (SLS)',
      printTime: '12 hours',
      scale: '150mm width'
    },
    featured: true
  },
  {
    id: 'matte-resin-black',
    name: 'Matte Resin - Technical Grade',
    category: 'materials',
    price: 89,
    image: '/products/matte-resin-black.jpg',
    description: '500ml container of high-detail matte resin. Professional-grade for intricate prints with exceptional surface finish. UV-cured.',
    specs: {
      material: 'SLS Nylon/Resin Blend',
      printTime: 'N/A',
      scale: '500ml container'
    }
  },
  {
    id: 'cipher-duo',
    name: 'Cipher Duo Set',
    category: 'toys',
    price: 299,
    image: '/products/cipher-duo.jpg',
    description: 'Two complementary forms exploring symmetry and asymmetry. Matte black and cream variants. Limited edition.',
    specs: {
      material: 'Composite Resin',
      printTime: '10 hours per piece',
      scale: '100mm each'
    }
  },
  {
    id: 'pearl-filament',
    name: 'Pearl Silk Filament - Natural',
    category: 'materials',
    price: 42,
    image: '/products/pearl-filament.jpg',
    description: 'Iridescent silk filament with pearl finish. Creates a subtle shimmer on finished prints. 1kg professional spool.',
    specs: {
      material: 'PLA + Pearl Additive',
      printTime: 'Standard speed',
      scale: '1kg spool'
    }
  }
]

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id)
}

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.featured)
}

export const getProductsByCategory = (category: 'toys' | 'materials'): Product[] => {
  return products.filter(p => p.category === category)
}
