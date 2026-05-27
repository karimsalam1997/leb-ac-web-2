import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const studioDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(studioDir, '..', '..')
const sourceFile = path.join(repoRoot, 'longform-essays.md')
const outputFile = path.join(repoRoot, 'studio-lebanese-academic', 'imports', 'essays.json')

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function keyFrom(value, fallback) {
  const base = slugify(value).slice(0, 32) || fallback
  return `${base}-${Math.random().toString(36).slice(2, 8)}`
}

function extractSectionBlock(content, startHeading, endHeading) {
  const start = content.indexOf(startHeading)

  if (start === -1) {
    return ''
  }

  const fromStart = content.slice(start + startHeading.length)

  if (!endHeading) {
    return fromStart.trim()
  }

  const end = fromStart.indexOf(endHeading)
  return (end === -1 ? fromStart : fromStart.slice(0, end)).trim()
}

function extractField(block, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = block.match(new RegExp(`\\*\\*${escapedLabel}:\\*\\*\\s*(.+)`))
  return match?.[1]?.trim() ?? ''
}

function extractNotes(block) {
  const notesMarker = '**Suggested footnotes/citations:**'
  const bodyMarker = '**Full body:**'
  const notesStart = block.indexOf(notesMarker)
  const bodyStart = block.indexOf(bodyMarker)

  if (notesStart === -1 || bodyStart === -1 || bodyStart <= notesStart) {
    return []
  }

  return block
    .slice(notesStart + notesMarker.length, bodyStart)
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      _key: `note-${index + 1}`,
      text: line.replace(/^\d+\.\s*/, '').trim(),
    }))
}

function extractBodySections(block) {
  const bodyMarker = '**Full body:**'
  const start = block.indexOf(bodyMarker)

  if (start === -1) {
    return []
  }

  const bodyBlocks = block
    .slice(start + bodyMarker.length)
    .trim()
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.replace(/\n/g, ' ').trim())
    .filter(Boolean)

  const sections = []

  bodyBlocks.forEach((bodyBlock) => {
    const headingMatch = bodyBlock.match(/^###\s+(.+)/)

    if (headingMatch) {
      sections.push({
        heading: headingMatch[1].trim(),
        paragraphs: [],
      })
      return
    }

    if (!sections.length) {
      sections.push({paragraphs: []})
    }

    sections[sections.length - 1].paragraphs.push(bodyBlock)
  })

  return sections.filter((section) => section.paragraphs.length)
}

function splitEntries(section) {
  return section
    .split(/^## /m)
    .slice(1)
    .map((entry) => {
      const [titleLine, ...rest] = entry.split('\n')
      return {
        title: titleLine.trim(),
        block: rest.join('\n').trim(),
      }
    })
}

function parseDate(value) {
  if (!value) {
    return undefined
  }

  const parsed = new Date(`${value} 12:00:00 UTC`)

  if (Number.isNaN(parsed.valueOf())) {
    return undefined
  }

  return parsed.toISOString().slice(0, 10)
}

function span(text) {
  return {
    _key: keyFrom(text, 'span'),
    _type: 'span',
    marks: [],
    text,
  }
}

function block(text, style = 'normal') {
  return {
    _key: keyFrom(text, 'block'),
    _type: 'block',
    style,
    markDefs: [],
    children: [span(text)],
  }
}

function portableTextFromSections(sections) {
  return sections.flatMap((section) => {
    const blocks = []

    if (section.heading) {
      blocks.push(block(section.heading, 'h2'))
    }

    section.paragraphs.forEach((paragraph) => {
      blocks.push(block(paragraph))
    })

    return blocks
  })
}

function parseEssays() {
  const content = fs.readFileSync(sourceFile, 'utf8')
  const flagshipBlock = extractSectionBlock(content, '# Flagship Essay', '# Essays')
  const essayBlock = extractSectionBlock(content, '# Essays', '# Letters')
  const entries = [...splitEntries(flagshipBlock), ...splitEntries(essayBlock)]
  const importedAt = new Date().toISOString()

  const essays = entries.map(({title, block: entryBlock}, index) => {
    const actualTitle = extractField(entryBlock, 'Final title') || title
    const sections = extractBodySections(entryBlock)
    const paragraphs = sections.flatMap((section) => section.paragraphs)
    const publicationDate = parseDate(extractField(entryBlock, 'Publication date'))
    const slug = slugify(actualTitle)

    return {
      _id: `essay-${slug}`,
      _type: 'essay',
      title: actualTitle,
      slug: {_type: 'slug', current: slug},
      dek: extractField(entryBlock, 'Dek'),
      byline: extractField(entryBlock, 'Byline') || 'Karim Salam',
      publicationDate,
      readTime: extractField(entryBlock, 'Estimated reading time').replace('minutes', 'min read'),
      category: index === 0 ? 'Featured Essay' : 'Essay',
      tags: extractField(entryBlock, 'Topic tags')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      excerpt: extractField(entryBlock, 'Excerpt') || paragraphs[0] || '',
      pullQuote:
        extractField(entryBlock, 'Pull quote').replace(/^"|"$/g, '') ||
        paragraphs[1] ||
        paragraphs[0] ||
        '',
      body: portableTextFromSections(sections),
      notes: extractNotes(entryBlock),
      relatedSlugs: [],
      seo: {
        title: extractField(entryBlock, 'SEO title') || undefined,
        description: extractField(entryBlock, 'SEO description') || undefined,
        keywords: extractField(entryBlock, 'SEO keywords')
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      },
      source: {
        file: 'longform-essays.md',
        importedAt,
      },
    }
  })

  essays.forEach((essay, index) => {
    essay.relatedSlugs = essays
      .filter((_, innerIndex) => innerIndex !== index)
      .slice(0, 3)
      .map((candidate) => candidate.slug.current)
  })

  return essays
}

const essays = parseEssays()
fs.mkdirSync(path.dirname(outputFile), {recursive: true})
fs.writeFileSync(outputFile, `${JSON.stringify(essays, null, 2)}\n`)
console.log(`Prepared ${essays.length} essays for import`)
console.log(outputFile)
