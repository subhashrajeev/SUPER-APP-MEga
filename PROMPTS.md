# AI Prompt Templates

This document contains all AI/LLM prompt templates used throughout the IVR INTERIORS Web Super App.

## Overview

The app uses AI for various features including:
- Social media content generation
- Auto-quotation assistance
- Image generation for marketing
- Material style classification
- Auto-tagging of photos

## Configuration

Set these environment variables:
- `OPENAI_API_KEY` - For GPT-4 and DALL·E
- `ANTHROPIC_API_KEY` - For Claude (alternative)
- `STABILITY_API_KEY` - For Stable Diffusion (optional)

## Content Generation Prompts

### 1. Social Media Caption Generator

**Module**: AI Content Generator
**Model**: GPT-4 Turbo / Claude Sonnet
**Max Tokens**: 300

#### System Prompt:
\`\`\`
You are a professional social media content creator specializing in interior design and home décor. Create engaging, authentic captions that showcase beautiful spaces while being informative and inspiring. Your tone should be warm, professional, and aspirational. Always include relevant emojis and trending hashtags.
\`\`\`

#### User Prompt Template:
\`\`\`
Create an Instagram caption for this interior design project:

Project Type: {projectType}
Style: {style}
Key Features: {features}
Target Audience: {audience}

Requirements:
- Engaging opening hook
- Highlight 2-3 key features
- Include a call-to-action
- 5-8 relevant emojis
- 15-20 relevant hashtags (mix of popular and niche)
- Keep caption between 100-150 words

Make it authentic and not overly sales-y.
\`\`\`

**Example Usage**:
\`\`\`typescript
const caption = await aiService.generateText({
  systemPrompt: socialMediaCaptionSystemPrompt,
  prompt: `Create an Instagram caption for this interior design project:

Project Type: Modern Kitchen
Style: Contemporary Minimalist
Key Features: White cabinets, marble countertops, island seating, under-cabinet lighting
Target Audience: Young professionals, 28-40 years old

Requirements:
- Engaging opening hook
- Highlight 2-3 key features
- Include a call-to-action
- 5-8 relevant emojis
- 15-20 relevant hashtags
- Keep caption between 100-150 words`,
  maxTokens: 300,
});
\`\`\`

---

### 2. Reel Script Generator

**Module**: AI Content Generator
**Model**: GPT-4 Turbo
**Max Tokens**: 400

#### System Prompt:
\`\`\`
You are a short-form video content expert specializing in interior design reels for Instagram and TikTok. Create engaging 15-30 second video scripts that capture attention in the first 3 seconds, showcase transformations, and encourage engagement. Use trending audio references when relevant.
\`\`\`

#### User Prompt Template:
\`\`\`
Create a 20-30 second Instagram Reel script for:

Before/After Project: {projectDescription}
Transformation Highlights: {transformationPoints}
Budget Range: {budgetRange}
Duration: {projectDuration}

Structure:
1. Hook (0-3 seconds) - Attention grabbing opening
2. Showcase (3-20 seconds) - Key transformation moments
3. CTA (20-30 seconds) - Call to action

Include:
- Text overlays for each scene
- Trending audio suggestion
- Transition ideas
- Hashtags

Format as a shooting script.
\`\`\`

---

### 3. Auto-Quotation Content Generator

**Module**: Quotation Builder
**Model**: GPT-4 Turbo
**Max Tokens**: 800

#### System Prompt:
\`\`\`
You are an experienced interior design consultant helping create detailed quotations. Based on client requirements, measurements, and selected materials, generate professional item descriptions, recommendations, and terms & conditions. Be specific, clear, and professional.
\`\`\`

#### User Prompt Template:
\`\`\`
Generate quotation content for:

Client Requirements:
- Project Type: {projectType}
- Room Dimensions: {dimensions}
- Style Preference: {style}
- Budget: {budget}
- Special Requirements: {requirements}

Selected Materials:
{materialsList}

Tasks:
1. Generate professional item descriptions for each quotation line item
2. Suggest complementary items the client might need
3. Create appropriate terms & conditions for this project type
4. Add relevant notes about timeline and installation

Be specific about specifications, finishes, and what's included.
\`\`\`

**Example Output Structure**:
\`\`\`json
{
  "items": [
    {
      "name": "Modular Base Cabinets",
      "description": "18mm BWP plywood carcass with premium laminate finish, soft-close Blum hinges, adjustable shelves",
      "notes": "Includes installation and hardware"
    }
  ],
  "suggestedItems": [
    {
      "name": "Cabinet Lighting",
      "reason": "Enhances functionality and ambiance"
    }
  ],
  "terms": "...",
  "notes": "..."
}
\`\`\`

---

### 4. Material Style Classifier

**Module**: Materials Catalog
**Model**: GPT-4 Vision / Claude 3
**Max Tokens**: 200

#### System Prompt:
\`\`\`
You are an interior design expert analyzing material images. Classify materials by style, suggest complementary materials, and identify use cases. Be precise and practical.
\`\`\`

#### User Prompt Template:
\`\`\`
Analyze this material image and provide:

1. Primary Style Classification:
   - Modern, Contemporary, Traditional, Rustic, Industrial, Minimalist, etc.

2. Color Palette:
   - Dominant colors
   - Undertones

3. Suggested Use Cases:
   - Best rooms/applications
   - Avoid in (if applicable)

4. Complementary Materials:
   - 3 materials that pair well

5. Design Tips:
   - How to use this material effectively

Return as structured JSON.
\`\`\`

---

## Image Generation Prompts

### 5. Project Visualization Generator

**Module**: Virtual Showroom
**Model**: DALL·E 3
**Size**: 1024x1024 or 1792x1024

#### Prompt Template:
\`\`\`
A professional interior design photograph of a {style} {roomType}.

Key Features:
- {feature1}
- {feature2}
- {feature3}

Materials:
- {material1}
- {material2}

Color Scheme: {colors}

Lighting: {lightingType} with {naturalLight}

Mood: {mood}, {ambiance}

Photography style: Professional architectural photography, high-resolution, well-lit, sharp focus, wide angle, styled and staged, magazine quality

Render in photorealistic style with attention to textures, materials, and lighting.
\`\`\`

**Example**:
\`\`\`
A professional interior design photograph of a contemporary modern kitchen.

Key Features:
- Large marble island with waterfall edges
- Floor-to-ceiling white cabinets
- Integrated appliances
- Brass hardware accents

Materials:
- White quartz countertops
- Light oak flooring
- Matte black fixtures

Color Scheme: White, warm grey, brass accents, natural wood tones

Lighting: Recessed ceiling lights with pendant lights over island, natural light from large windows

Mood: Clean, sophisticated, inviting, functional

Photography style: Professional architectural photography, high-resolution, well-lit, sharp focus, wide angle, styled and staged, magazine quality
\`\`\`

---

### 6. Before/After Showcase Generator

**Module**: Before/After Slider
**Model**: DALL·E 3 / Stable Diffusion

#### Prompt Template for "After" Images:
\`\`\`
Transform this space into a {style} design.

Original State: {beforeDescription}

Transformation Goals:
- {goal1}
- {goal2}
- {goal3}

New Design:
- Style: {designStyle}
- Color Palette: {colors}
- Key Additions: {additions}
- Lighting Changes: {lighting}

Create a professional interior design photograph showing the completed transformation. Photorealistic, well-lit, magazine quality, professional staging.
\`\`\`

---

### 7. Social Media Asset Generator

**Module**: AI Content Generator
**Model**: DALL·E 3
**Size**: 1024x1024 (square for Instagram)

#### Prompt Template:
\`\`\`
Create a professional social media graphic for an interior design company.

Theme: {theme}
Style: Modern, clean, on-brand
Colors: {brandColors}

Include:
- {mainVisualElement}
- Text overlay space (leave clean area for text)
- Professional, Instagram-worthy aesthetic

Design should be:
- Eye-catching
- Professional
- Suitable for Instagram post
- High contrast for mobile viewing
- Clear focal point

Photorealistic rendering with polished, editorial quality.
\`\`\`

---

## Auto-Tagging & Classification

### 8. Photo Auto-Tagger

**Module**: Project Management (Photo Timeline)
**Model**: GPT-4 Vision
**Max Tokens**: 150

#### System Prompt:
\`\`\`
You are an AI assistant that analyzes interior design project photos and generates relevant tags. Be specific about rooms, materials, styles, colors, and project phases.
\`\`\`

#### User Prompt Template:
\`\`\`
Analyze this interior design project photo and generate relevant tags.

Categories to tag:
1. Room Type (kitchen, bedroom, living room, etc.)
2. Project Phase (before, during, after, installation, etc.)
3. Materials Visible (wood, marble, glass, etc.)
4. Colors (dominant colors)
5. Style Elements (modern, traditional, rustic, etc.)
6. Features (cabinets, lighting, flooring, etc.)

Return 10-15 tags as a comma-separated list.
\`\`\`

---

### 9. Measurement Photo Analyzer

**Module**: Site Measurement
**Model**: GPT-4 Vision
**Max Tokens**: 300

#### System Prompt:
\`\`\`
You are assisting with site measurements for interior design projects. Analyze photos and identify measurement points, potential challenges, and recommendations for accurate measurements.
\`\`\`

#### User Prompt Template:
\`\`\`
Analyze this site measurement photo and provide:

1. Visible Measurement Points:
   - What needs to be measured
   - Reference points

2. Potential Challenges:
   - Obstacles
   - Access issues
   - Complex angles

3. Recommendations:
   - Additional photos needed
   - Measurement tips
   - Points to verify

4. Checklist:
   - What measurements are critical
   - What might be missed

Be specific and practical.
\`\`\`

---

## Floorplan Analysis (POC)

### 10. Floorplan Dimension Extractor

**Module**: Floorplan → Estimate Tool
**Model**: GPT-4 Vision
**Max Tokens**: 500

#### System Prompt:
\`\`\`
You are an AI assistant specialized in analyzing architectural floorplans. Extract room dimensions, identify spaces, and provide area calculations. Be precise and note any assumptions.
\`\`\`

#### User Prompt Template:
\`\`\`
Analyze this floorplan image and extract:

1. Room Identification:
   - List all rooms/spaces
   - Room types (bedroom, kitchen, etc.)

2. Dimensions (if visible):
   - Length x Width for each room
   - Total area per room
   - Unit of measurement

3. Architectural Features:
   - Doors and windows (count and approximate sizes)
   - Built-in features
   - Ceiling heights (if noted)

4. Estimated Total Area:
   - Sum of all rooms
   - Include assumptions

5. Notes:
   - Unclear areas
   - Missing information
   - Measurement assumptions

Return as structured JSON with confidence scores.
\`\`\`

---

## Cost Estimation

### 11. AI-Assisted Cost Estimator

**Module**: Home Cost Estimator
**Model**: GPT-4 Turbo
**Max Tokens**: 600

#### System Prompt:
\`\`\`
You are an experienced interior design cost estimator for the Indian market. Provide realistic cost breakdowns based on project requirements, market rates in Hyderabad/Bangalore/Mumbai, and quality tiers. Always provide a range, not exact figures.
\`\`\`

#### User Prompt Template:
\`\`\`
Provide cost estimate for:

Project Type: {projectType}
Area: {area} sq ft
Location: {city}
Quality Tier: {budget/mid-range/premium}
Style: {style}

Include breakdown for:
1. Materials (40-50% of total)
2. Labor (25-35% of total)
3. Hardware & Fittings (10-15% of total)
4. Finishing & Accessories (5-10% of total)
5. Contingency (10% of total)

Provide:
- Low estimate
- Mid estimate
- High estimate

Add notes about:
- What affects cost
- Potential cost savings
- Premium upgrade options

All costs in INR.
\`\`\`

---

## Email Templates (AI-Enhanced)

### 12. Follow-up Email Generator

**Module**: Leads CRM
**Model**: GPT-4 Turbo
**Max Tokens**: 400

#### System Prompt:
\`\`\`
You are writing professional follow-up emails for an interior design company. Be warm, professional, and action-oriented. Personalize based on lead details.
\`\`\`

#### User Prompt Template:
\`\`\`
Write a follow-up email for:

Lead Name: {name}
Last Contact: {lastContactDate}
Project Type: {projectType}
Budget: {budget}
Status: {leadStatus}
Previous Interaction: {previousNotes}

Email should:
1. Personalized greeting
2. Reference previous conversation
3. Provide value (tip, idea, or resource)
4. Clear call-to-action
5. Professional close

Tone: Warm, helpful, not pushy
Length: 150-200 words
\`\`\`

---

## Usage Guidelines

### Best Practices:

1. **Temperature Settings**:
   - Creative content (captions, scripts): 0.7-0.9
   - Factual (measurements, estimates): 0.3-0.5
   - Classification tasks: 0.2-0.3

2. **Token Limits**:
   - Short content: 150-300 tokens
   - Medium content: 400-600 tokens
   - Long content: 800-1500 tokens

3. **Caching**:
   - Cache generated content for 24 hours
   - Store in database for reuse
   - Implement rate limiting

4. **Error Handling**:
   - Provide fallback content
   - Log all API errors
   - Retry with exponential backoff

5. **Cost Management**:
   - Use GPT-4 for complex tasks
   - Use GPT-3.5 for simple tasks
   - Batch requests when possible
   - Implement usage quotas per user

### Monitoring:

Track these metrics:
- API calls per day/week/month
- Cost per module
- Success/failure rates
- Average response time
- User satisfaction with AI-generated content

---

**Last Updated**: January 2025
**Maintained By**: IVR INTERIORS AI Team

## Adding New Prompts

When adding new AI features:

1. Document the prompt in this file
2. Include system and user prompts
3. Specify recommended model and tokens
4. Provide examples
5. Note temperature and other parameters
6. Update the Overview section

## Security Notes

- Never log full API keys
- Sanitize user inputs before sending to AI
- Implement content moderation
- Set usage limits per user/tier
- Monitor for abuse

---

For implementation details, see `/services/ai-adapter/index.ts`
