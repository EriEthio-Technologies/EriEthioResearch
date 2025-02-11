# Implementation Guide

## 1. Updating Hero Section

### Step 1: Edit Hero Text
1. Open `src/components/ui/hero-section.tsx`
2. Locate the main title:
   ```tsx
   <motion.h1 
     className="text-6xl font-bold text-neon-cyan"
     initial={{ scale: 0.9 }}
     animate={{ scale: 1 }}
     transition={{ duration: 0.5 }}
   >
     EriEthio Research
   </motion.h1>
   ```
3. Change the text between the `<motion.h1>` tags
4. Similarly, update the subtitle:
   ```tsx
   <motion.p 
     className="text-2xl text-neon-magenta"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ delay: 0.3 }}
   >
     Your New Subtitle Here
   </motion.p>
   ```

### Step 2: Customize Buttons
1. Find the buttons section:
   ```tsx
   <motion.div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
     <button className="px-8 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg">
       First Button Text
     </button>
     <button className="px-8 py-3 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded-lg">
       Second Button Text
     </button>
   </motion.div>
   ```
2. Update button text
3. Add click handlers:
   ```tsx
   <button 
     onClick={() => router.push('/your-path')}
     className="px-8 py-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg"
   >
     Button Text
   </button>
   ```

### Step 3: Customize Animations
1. Adjust title animation:
   ```tsx
   <motion.h1
     initial={{ scale: 0.9, y: -20 }}  // Starting state
     animate={{ scale: 1, y: 0 }}      // End state
     transition={{
       duration: 0.7,                  // Animation duration
       ease: "easeOut",                // Animation curve
       delay: 0.2                      // Delay before starting
     }}
   >
   ```
2. Modify subtitle animation timing:
   ```tsx
   <motion.p
     transition={{ delay: 0.5, duration: 0.8 }}
   >
   ```
3. Add hover effects to buttons:
   ```tsx
   <motion.button
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
     transition={{ duration: 0.2 }}
   >
   ```

## 2. Managing Feature Grid

### Step 1: Edit Feature Content
1. Open `src/components/ui/feature-grid.tsx`
2. Locate the features array:
   ```tsx
   const features = [
     {
       icon: Beaker,
       title: 'Research Excellence',
       description: 'Cutting-edge research methodologies and tools'
     },
     // More features...
   ];
   ```
3. Edit existing features or add new ones:
   ```tsx
   const features = [
     {
       icon: Beaker,
       title: 'Your New Feature',
       description: 'Your feature description'
     },
     {
       icon: BookOpen,
       title: 'Another Feature',
       description: 'Another description'
     }
   ];
   ```

### Step 2: Add Custom Icons
1. Import additional icons from lucide-react:
   ```tsx
   import { 
     Beaker, 
     BookOpen, 
     Users, 
     Lightbulb,
     Flask,
     Brain,
     // Add more icons...
   } from 'lucide-react';
   ```
2. Use new icons in features array:
   ```tsx
   {
     icon: Brain,
     title: 'AI Research',
     description: 'Advanced artificial intelligence solutions'
   }
   ```

### Step 3: Customize Feature Cards
1. Modify card styling:
   ```tsx
   <motion.div
     className="flex flex-col items-center p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-colors"
   >
   ```
2. Adjust icon container:
   ```tsx
   <div className="p-4 rounded-full bg-neon-cyan/20 mb-4">
     <Icon className="w-8 h-8 text-neon-cyan" />
   </div>
   ```
3. Customize text styling:
   ```tsx
   <h3 className="text-xl font-semibold text-neon-cyan mb-2">
     {feature.title}
   </h3>
   <p className="text-gray-400 text-center">
     {feature.description}
   </p>
   ```

### Step 4: Adjust Grid Layout
1. Modify grid container:
   ```tsx
   <motion.div
     variants={container}
     className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 max-w-7xl mx-auto mt-16"
   >
   ```
2. Customize grid spacing:
   ```tsx
   className="... gap-8 px-4 py-12"  // Adjust gap and padding
   ```
3. Add responsive breakpoints:
   ```tsx
   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
   ```

### Step 5: Add Animations
1. Define animation variants:
   ```tsx
   const container = {
     hidden: { opacity: 0 },
     show: {
       opacity: 1,
       transition: {
         staggerChildren: 0.2
       }
     }
   };

   const item = {
     hidden: { opacity: 0, y: 20 },
     show: { opacity: 1, y: 0 }
   };
   ```
2. Apply to container:
   ```tsx
   <motion.div
     variants={container}
     initial="hidden"
     animate="show"
     className="grid..."
   >
   ```
3. Apply to individual features:
   ```tsx
   <motion.div
     variants={item}
     whileHover={{ scale: 1.05 }}
     className="flex flex-col..."
   >
   ```

## 3. Adding Research Projects

### Step 1: Access Admin Dashboard
1. Navigate to `/admin` in your browser
2. Sign in with admin credentials
3. Click on "Research" in the sidebar

### Step 2: Create New Project
1. Click "Add Project" button
2. Fill in basic details:
   ```typescript
   {
     title: "Your Research Project",
     description: "Detailed project description",
     methodology: "Research methodology details",
     status: "planning", // or "in_progress", "completed"
     startDate: "2024-03-16",
     endDate: "2024-12-31",
     tags: ["AI", "Healthcare", "Innovation"]
   }
   ```

### Step 3: Add Collaborators
1. Click "Collaborators" tab
2. Click "Add Collaborator"
3. Fill collaborator details:
   ```typescript
   {
     name: "Researcher Name",
     email: "researcher@example.com",
     role: "researcher", // or "advisor", "contributor"
     joinDate: "2024-03-16"
   }
   ```

### Step 4: Set Milestones
1. Click "Milestones" tab
2. Add milestone:
   ```typescript
   {
     title: "Research Phase 1",
     description: "Initial data collection",
     dueDate: "2024-06-30",
     priority: "high",
     status: "pending"
   }
   ```

### Step 5: Link Publications
1. Click "Publications" tab
2. Add publication:
   ```typescript
   {
     title: "Research Paper Title",
     authors: ["Author 1", "Author 2"],
     journal: "Journal Name",
     publicationDate: "2024-05-15",
     doi: "10.1234/example",
     url: "https://example.com/paper"
   }
   ```

## 4. Managing Products

### Step 1: Create Product
1. Go to Admin Dashboard → Products
2. Click "Add Product"
3. Fill basic information:
   ```typescript
   {
     title: "Product Name",
     description: "Detailed description",
     category: "Research Tools",
     price: 999.99,
     status: "active"
   }
   ```

### Step 2: Add Product Details
1. Add features:
   ```typescript
   features: [
     "Key feature 1",
     "Key feature 2",
     "Key feature 3"
   ]
   ```
2. Set specifications:
   ```typescript
   specifications: {
     "Technology": "Advanced AI",
     "Platform": "Cloud-based",
     "Integration": "API Available"
   }
   ```
3. List benefits:
   ```typescript
   benefits: [
     "Benefit 1 description",
     "Benefit 2 description",
     "Benefit 3 description"
   ]
   ```

### Step 3: Upload Images
1. Prepare product images:
   - Main image: 1200x800px
   - Thumbnail: 400x400px
   - Gallery images: 1200x800px
2. Upload through admin interface
3. Set image order and captions

### Step 4: Configure Display Options
1. Set product visibility
2. Choose featured status
3. Configure related products
4. Set SEO metadata

## 5. Creating Blog Articles

### Step 1: Write Content
1. Go to Admin Dashboard → Blog
2. Click "New Article"
3. Fill in metadata:
   ```typescript
   {
     title: "Article Title",
     subtitle: "Optional subtitle",
     author: "Author Name",
     category: "Research",
     tags: ["Tag1", "Tag2"]
   }
   ```

### Step 2: Add Content
1. Use rich text editor:
   ```markdown
   # Main Heading
   ## Subheading
   
   Content paragraphs...

   - Bullet points
   - More points

   1. Numbered list
   2. Second item
   ```
2. Add code snippets:
   ```markdown
   ```python
   def example():
       return "Hello World"
   ```
   ```

### Step 3: Add Media
1. Upload featured image:
   - Size: 1600x900px
   - Format: JPG/PNG
   - Alt text: "Descriptive text"
2. Add inline images
3. Embed videos or charts

### Step 4: Publish
1. Preview article
2. Set publication date
3. Choose status:
   - Draft
   - Published
   - Scheduled

## 6. Styling Cards and Sections

### Step 1: Use Gradient Presets
1. Import gradient styles:
   ```tsx
   const gradients = {
     blue: { from: '#1cc2ff', to: '#00ccff' },
     magenta: { from: '#ff2079', to: '#ff9d00' },
     purple: { from: '#7928ca', to: '#ff0080' }
   };
   ```
2. Apply to cards:
   ```tsx
   <FlipCard
     gradient={gradients.blue}
     // other props...
   />
   ```

### Step 2: Customize Animations
1. Define animation variants:
   ```tsx
   const cardVariants = {
     hidden: { opacity: 0, y: 20 },
     visible: { opacity: 1, y: 0 },
     hover: { scale: 1.05 }
   };
   ```
2. Apply to components:
   ```tsx
   <motion.div
     variants={cardVariants}
     initial="hidden"
     animate="visible"
     whileHover="hover"
   >
   ```

### Step 3: Adjust Layout
1. Modify spacing:
   ```tsx
   <div className="space-y-8 px-4 py-12">
   ```
2. Update grid layout:
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
   ```
3. Customize responsive behavior:
   ```tsx
   <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
   ``` 