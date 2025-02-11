# Content Management Guide

## Overview
This guide explains how to manage content on the EriEthio Research Website, including creating and managing products, blog posts, case studies, and user management.

## Accessing the Admin Dashboard

1. Sign in with your admin account at `/auth/signin`
2. Navigate to `/admin` to access the admin dashboard

## Updating Hero Section

1. Navigate to `src/components/ui/hero-section.tsx`
2. Update the following content:
   ```tsx
   <motion.h1>EriEthio Research</motion.h1>
   <motion.p>Advancing Research & Innovation</motion.p>
   ```
3. Customize button text and links:
   ```tsx
   <button>Explore Research</button>
   <button>View Projects</button>
   ```

## Managing Feature Grid

1. Open `src/components/ui/feature-grid.tsx`
2. Edit the features array:
   ```tsx
   const features = [
     {
       icon: Beaker,
       title: 'Research Excellence',
       description: 'Your description here'
     },
     // Add more features...
   ];
   ```

## Adding Research Projects

1. Go to Admin Dashboard → Research
2. Click "Add Project"
3. Fill in the required fields:
   - Title
   - Description
   - Methodology
   - Lead Researcher
   - Status
   - Start/End Dates
   - Tags
4. Add collaborators (optional):
   - Click "Collaborators" tab
   - Add researchers with their roles
5. Add milestones (optional):
   - Click "Milestones" tab
   - Set milestone titles, dates, and priorities
6. Add publications (optional):
   - Click "Publications" tab
   - Link research papers and articles

## Managing Products

1. Go to Admin Dashboard → Products
2. Click "Add Product"
3. Fill in product details:
   - Title
   - Description
   - Features (bullet points)
   - Specifications (key-value pairs)
   - Benefits
   - Price (if applicable)
   - Category
   - Tags
4. Add product image:
   - Upload high-quality image (recommended: 1200x800px)
   - Ensure image is optimized for web

## Creating Blog Articles

1. Go to Admin Dashboard → Blog
2. Click "New Article"
3. Fill in article details:
   - Title
   - Content (supports Markdown)
   - Featured Image
   - Category
   - Tags
4. Use the rich text editor for:
   - Formatting text
   - Adding images
   - Embedding code snippets
   - Creating lists
5. Preview before publishing
6. Set publication status:
   - Draft
   - Published
   - Scheduled

## Managing Case Studies

1. Go to Admin Dashboard → Case Studies
2. Click "Add Case Study"
3. Fill in case study details:
   - Title
   - Client Information
   - Challenge Description
   - Solution
   - Results/Outcomes
   - Technologies Used
4. Add supporting materials:
   - Images
   - Charts/Graphs
   - Testimonials
   - Related Research

## Updating Featured Content

### Home Page Featured Items

1. Open `src/app/page.tsx`
2. Update featured research:
   ```tsx
   const featuredResearch = [
     {
       title: "Your Title",
       subtitle: "Your Subtitle",
       summary: "Your Summary",
       tags: ["tag1", "tag2"],
       gradient: { from: '#color1', to: '#color2' }
     },
     // Add more items...
   ];
   ```
3. Similarly update `featuredCases` and `featuredBlogs`

### Featured Cards Styling

1. Customize card appearance in `src/components/ui/FlipCard.tsx`
2. Available gradient presets:
   ```tsx
   // Blue to Cyan
   gradient: { from: '#1cc2ff', to: '#00ccff' }
   
   // Magenta to Orange
   gradient: { from: '#ff2079', to: '#ff9d00' }
   
   // Purple to Pink
   gradient: { from: '#7928ca', to: '#ff0080' }
   ```

## Adding Team Members

1. Go to Admin Dashboard → Users
2. Click "Add User"
3. Fill in user details:
   - Full Name
   - Email
   - Role (researcher/admin)
   - Bio
   - Profile Image
4. Send invitation
5. User will receive email to set password

## Content Guidelines

### Images
- Use high-quality images (min 1200px width)
- Optimize for web performance
- Maintain 16:9 aspect ratio for featured images
- Use PNG for graphics, JPG for photos

### Text Content
- Keep titles under 60 characters
- Write clear, concise descriptions
- Use proper headings hierarchy
- Include relevant keywords
- Break long content into sections

### Tags and Categories
- Use consistent naming conventions
- Keep tags focused and relevant
- Limit to 5-7 tags per item
- Use existing categories when possible

## SEO Best Practices

1. For each content piece:
   - Write compelling titles
   - Add meta descriptions
   - Use descriptive URLs
   - Include alt text for images
   - Structure content with proper headings

2. Technical considerations:
   - Optimize images
   - Use semantic HTML
   - Ensure mobile responsiveness
   - Monitor loading speed

## Troubleshooting

Common issues and solutions:

1. Images not displaying:
   - Check file path
   - Verify file format
   - Ensure proper optimization
   - Check Supabase storage permissions

2. Content not updating:
   - Clear browser cache
   - Verify save operation
   - Check database connection
   - Review error logs

3. Formatting issues:
   - Check Markdown syntax
   - Verify HTML structure
   - Review CSS classes
   - Test responsive layouts 