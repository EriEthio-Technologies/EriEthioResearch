# Components Guide

## Overview

This guide provides detailed documentation for all components available in the system. Each component is designed to be reusable, customizable, and accessible.

## Table of Contents

1. [UI Components](#ui-components)
2. [Page Components](#page-components)
3. [Form Components](#form-components)
4. [Data Display Components](#data-display-components)
5. [Navigation Components](#navigation-components)
6. [Admin Components](#admin-components)
7. [Education Components](#education-components)

## UI Components

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button
  variant="default" // default | primary | secondary | outline | ghost
  size="md" // sm | md | lg
  disabled={false}
  loading={false}
  onClick={() => {}}
>
  Click Me
</Button>
```

### Card
```tsx
import { Card } from '@/components/ui/card';

<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

### Input
```tsx
import { Input } from '@/components/ui/input';

<Input
  type="text" // text | email | password | number
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  disabled={false}
  error={false}
/>
```

### Select
```tsx
import { Select } from '@/components/ui/select';

<Select
  value={value}
  onValueChange={(value) => setValue(value)}
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  placeholder="Select an option"
  disabled={false}
/>
```

### ColorPicker
```tsx
import { ColorPicker } from '@/components/ui/color-picker';

<ColorPicker
  value={color}
  onChange={(color) => setColor(color)}
/>
```

## Page Components

### HeroSection
```tsx
import { HeroSection } from '@/components/ui/hero-section';

<HeroSection
  title="Welcome"
  subtitle="Subtitle text here"
  buttons={[
    { text: 'Get Started', href: '/start', variant: 'primary' },
    { text: 'Learn More', href: '/about', variant: 'secondary' }
  ]}
  align="center" // left | center | right
  background="gradient" // gradient | image | video
  backgroundUrl="optional-image-url.jpg"
/>
```

### FeatureGrid
```tsx
import { FeatureGrid } from '@/components/ui/feature-grid';

<FeatureGrid
  title="Features"
  items={[
    {
      icon: 'Star',
      title: 'Feature 1',
      description: 'Description here'
    }
  ]}
  columns={3}
  gap="lg" // sm | md | lg
  padding="lg" // sm | md | lg
/>
```

### FlipCard
```tsx
import { FlipCard } from '@/components/ui/FlipCard';

<FlipCard
  title="Card Title"
  subtitle="Optional subtitle"
  summary="Card summary"
  tags={['tag1', 'tag2']}
  imageUrl="optional-image.jpg"
  gradient={{
    from: '#color1',
    to: '#color2'
  }}
  onClick={() => {}}
/>
```

## Form Components

### Form
```tsx
import { Form } from '@/components/ui/form';

<Form
  onSubmit={handleSubmit}
  defaultValues={{}}
  validation={{}}
>
  {/* Form fields */}
</Form>
```

### TextArea
```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text..."
  rows={4}
  disabled={false}
  error={false}
/>
```

### Checkbox
```tsx
import { Checkbox } from '@/components/ui/checkbox';

<Checkbox
  checked={checked}
  onCheckedChange={(checked) => setChecked(checked)}
  label="Checkbox label"
  disabled={false}
/>
```

### Switch
```tsx
import { Switch } from '@/components/ui/switch';

<Switch
  checked={enabled}
  onCheckedChange={(enabled) => setEnabled(enabled)}
  label="Toggle label"
  disabled={false}
/>
```

## Data Display Components

### Table
```tsx
import { Table } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Tabs
```tsx
import { Tabs } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Dialog
```tsx
import { Dialog } from '@/components/ui/dialog';

<Dialog
  open={open}
  onOpenChange={setOpen}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

## Navigation Components

### NavHeader
```tsx
import { NavHeader } from '@/components/ui/nav-header';

<NavHeader
  logo="logo.png"
  navigation={[
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' }
  ]}
/>
```

### Footer
```tsx
import { Footer } from '@/components/ui/footer';

<Footer
  logo="logo.png"
  navigation={[
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' }
  ]}
  social={[
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: GitHub }
  ]}
/>
```

## Admin Components

### PageBuilder
```tsx
import { PageBuilder } from '@/components/admin/PageBuilder';

<PageBuilder
  initialData={pageData}
  selectedSection={selectedSection}
  onSectionSelect={(sectionId) => {}}
  onSave={(data) => {}}
  onCancel={() => {}}
  saving={false}
/>
```

### PageSections
```tsx
import { PageSections } from '@/components/admin/PageSections';

<PageSections
  sections={sections}
  onUpdate={(sections) => {}}
/>
```

### SEOSettings
```tsx
import { SEOSettings } from '@/components/admin/SEOSettings';

<SEOSettings
  initialData={seoData}
  onUpdate={(data) => {}}
/>
```

### UserPermissions
```tsx
import { UserPermissions } from '@/components/admin/UserPermissions';

<UserPermissions />
```

### PageAnalytics
```tsx
import { PageAnalytics } from '@/components/admin/PageAnalytics';

<PageAnalytics />
```

### PageCustomization
```tsx
import { PageCustomization } from '@/components/admin/PageCustomization';

<PageCustomization
  initialSettings={settings}
  onUpdate={(settings) => {}}
/>
```

## Education Components

### CourseCard
```tsx
import { CourseCard } from '@/components/education/CourseCard';

<CourseCard
  title="Course Title"
  description="Course description"
  thumbnail="thumbnail.jpg"
  duration="2 hours"
  level="beginner"
  progress={50}
  onClick={() => {}}
/>
```

### LearningPathCard
```tsx
import { LearningPathCard } from '@/components/LearningPathCard';

<LearningPathCard
  id="path-id"
  title="Path Title"
  description="Path description"
  estimatedDuration="4 weeks"
  difficulty="intermediate"
  isOfficial={true}
  requiresSubscription={false}
  progress={{
    completed: 5,
    total: 10,
    status: 'in_progress'
  }}
  items={[
    { type: 'course', title: 'Course 1', completed: true },
    { type: 'quiz', title: 'Quiz 1', completed: false }
  ]}
  isSubscribed={true}
  onClick={() => {}}
/>
```

### CodeEditor
```tsx
import { CodeEditor } from '@/components/CodeEditor';

<CodeEditor
  initialCode="console.log('Hello');"
  language="javascript"
  testCases={[
    {
      input: '',
      expected_output: 'Hello',
      hidden: false
    }
  ]}
  onSave={(code) => {}}
  onSubmit={(code, results) => {}}
  readOnly={false}
/>
```

### AchievementsGrid
```tsx
import { AchievementsGrid } from '@/components/AchievementsGrid';

<AchievementsGrid
  badges={[
    {
      id: 'badge-1',
      title: 'First Course',
      description: 'Completed your first course',
      imageUrl: 'badge.png',
      category: 'courses',
      points: 100,
      earnedAt: '2024-03-16',
      criteria: {}
    }
  ]}
  certificates={[
    {
      id: 'cert-1',
      title: 'Course Certificate',
      description: 'Course completion certificate',
      type: 'course',
      imageUrl: 'certificate.png',
      issuedAt: '2024-03-16',
      verificationCode: 'ABC123'
    }
  ]}
  onShare={(item) => {}}
/>
```

Each component is designed to be:
- Fully typed with TypeScript
- Accessible (ARIA compliant)
- Responsive
- Customizable through props
- Well-documented with PropTypes
- Tested with Jest and React Testing Library

For more detailed documentation on each component, including all available props and usage examples, please refer to the component's source code or the Storybook documentation. 