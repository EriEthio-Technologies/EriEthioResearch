# Content Editor Guide

## Overview

The Content Management System (CMS) provides a powerful and user-friendly interface for creating and managing various types of content, including blog posts, research articles, and case studies. This guide covers all features and functionalities of the content editor.

## Accessing the Editor

1. Navigate to `/admin/content` in your browser
2. Sign in with your admin credentials
3. Click "New Content" or select existing content to edit

## Editor Features

### Markdown Editor

The editor supports Markdown with real-time preview and enhanced features:

#### Keyboard Shortcuts
- `Ctrl+B` - Bold text
- `Ctrl+I` - Italic text
- `Ctrl+K` - Code block
- `Ctrl+L` - Insert link
- `Ctrl+1` - Heading 1
- `Ctrl+2` - Heading 2
- `Ctrl+Q` - Quote
- `Ctrl+U` - Bullet list
- `Ctrl+O` - Numbered list
- `Ctrl+T` - Task list
- `Ctrl+S` - Save
- `Ctrl+Z` - Undo
- `Ctrl+Shift+Z` - Redo

#### Toolbar Functions
1. **Text Formatting**
   - Headings (H1, H2)
   - Bold, Italic, Strikethrough
   - Lists (Bullet, Numbered, Tasks)
   - Quotes
   - Code blocks

2. **Advanced Features**
   - Table generator
   - Image upload
   - Link insertion
   - Text alignment
   - Code syntax highlighting

3. **View Options**
   - Split view (Editor/Preview)
   - Full-screen editing
   - Word/character count
   - Auto-save status

### Image Management

#### Featured Image
1. Click the image upload area
2. Select or drag an image
3. Crop/adjust if needed
4. Save changes

#### Image Gallery
1. Drag and drop multiple images
2. Reorder by dragging
3. Delete unwanted images
4. Add captions
5. Maximum 10 images per content

### Content Organization

#### Tags
1. Type tag name in the input field
2. Press Enter or click "Add"
3. Click × to remove tags
4. Best practices:
   - Use relevant keywords
   - Keep tags concise
   - Limit to 5-7 tags
   - Use existing tags when possible

#### Status Management
- **Draft**: Work in progress
- **Published**: Visible to public
- **Archived**: Hidden from public

## Content Types

### Blog Posts
1. **Structure**
   - Title
   - Featured image
   - Content (Markdown)
   - Tags
   - Category
   - Status

2. **Best Practices**
   - Use engaging titles
   - Include relevant images
   - Structure with headings
   - Add meta description
   - Tag appropriately

### Research Articles
1. **Structure**
   - Title
   - Abstract
   - Methodology
   - Findings
   - References
   - Tags
   - Status

2. **Best Practices**
   - Clear methodology
   - Cite sources
   - Include data/charts
   - Link related research
   - Use academic tags

### Case Studies
1. **Structure**
   - Title
   - Client info
   - Challenge
   - Solution
   - Results
   - Testimonials
   - Status

2. **Best Practices**
   - Focus on outcomes
   - Include metrics
   - Add client quotes
   - Use visuals
   - Link to research

## Markdown Guide

### Basic Syntax
```markdown
# Heading 1
## Heading 2

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet point
1. Numbered list
- [ ] Task list item

> Quote

[Link text](url)

![Image alt text](image-url)
```

### Advanced Features
```markdown
<!-- Tables -->
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

<!-- Code blocks -->
```python
def example():
    return "Hello World"
```

<!-- Text alignment -->
::: center
Centered text
:::

<!-- Task lists -->
- [x] Completed task
- [ ] Pending task
```

## Tips & Tricks

### Performance
1. **Images**
   - Optimize before upload
   - Use appropriate sizes
   - Limit gallery size
   - Use descriptive alt text

2. **Content**
   - Use headings properly
   - Break into sections
   - Include meta data
   - Preview before publishing

### SEO Best Practices
1. **Titles**
   - Use keywords naturally
   - Keep under 60 characters
   - Be descriptive
   - Include main topic

2. **Content**
   - Use subheadings (H2, H3)
   - Include keywords
   - Write meta descriptions
   - Add alt text to images

3. **URLs**
   - Use descriptive slugs
   - Include keywords
   - Keep it short
   - Use hyphens

## Troubleshooting

### Common Issues

1. **Image Upload Fails**
   - Check file size
   - Verify format
   - Try optimizing
   - Check permissions

2. **Content Not Saving**
   - Check connection
   - Look for error messages
   - Try manual save
   - Check auto-save status

3. **Preview Not Working**
   - Check markdown syntax
   - Refresh preview
   - Clear cache
   - Check console errors

### Support

For additional help:
1. Check error messages
2. Review logs
3. Contact support team
4. Report bugs

## Security

### Best Practices
1. Always log out
2. Use strong passwords
3. Don't share credentials
4. Review changes
5. Back up content 