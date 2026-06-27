from __future__ import annotations

import html
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import inch
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch as INCH
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image as RLImage,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parents[1]
BOOK = Path(
    "/Users/karimsalam/Documents/Books/"
    "The precarious republic ; political modernization in Lebanon -- [by] Michael C_ Hudson_ "
    "Consulting editor_ Leonard Binder -- New York, New York State, -- oclc 443795 -- "
    "eaa267f6e51ef4980d017efc776565b8 -- Anna’s Archive.pdf"
)
OUT_DIR = PROJECT / "output" / "pdf"
OUT_DIR.mkdir(parents=True, exist_ok=True)
PDF_OUT = OUT_DIR / "precarious-republic-reading-edition.pdf"
MD_OUT = ROOT / "precarious-republic-research-dossier.md"
TEXTURE = ROOT / "paper_texture.png"
IMAGE_DIR = ROOT / "book-images"

PAGE_W, PAGE_H = 6.8 * INCH, 9.65 * INCH
MARGIN_X = 0.64 * INCH
MARGIN_TOP = 0.72 * INCH
MARGIN_BOTTOM = 0.68 * INCH

INK = colors.HexColor("#241d18")
MUTED = colors.HexColor("#6f6456")
CLAY = colors.HexColor("#8b3f2a")
OLIVE = colors.HexColor("#5e6645")
BLUE = colors.HexColor("#435e6f")
PAPER = colors.HexColor("#f2ead7")
WASH = colors.HexColor("#eadcc1")
PALE_BLUE = colors.HexColor("#dbe5e6")
PALE_CLAY = colors.HexColor("#ecd0bf")


def register_fonts() -> dict[str, str]:
    fonts = {
        "body": "Georgia",
        "body_bold": "Georgia-Bold",
        "body_italic": "Georgia-Italic",
        "display": "BigCaslon",
    }
    paths = {
        "Georgia": "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "Georgia-Bold": "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
        "Georgia-Italic": "/System/Library/Fonts/Supplemental/Georgia Italic.ttf",
        "BigCaslon": "/System/Library/Fonts/Supplemental/BigCaslon.ttf",
    }
    for name, path in paths.items():
        try:
            pdfmetrics.registerFont(TTFont(name, path))
        except Exception:
            if name == "BigCaslon":
                fonts["display"] = "Times-Roman"
            elif name.endswith("Bold"):
                fonts["body_bold"] = "Times-Bold"
            elif name.endswith("Italic"):
                fonts["body_italic"] = "Times-Italic"
            else:
                fonts["body"] = "Times-Roman"
    return fonts


FONTS = register_fonts()


def make_texture() -> None:
    if TEXTURE.exists():
        return
    w, h = 1400, 2000
    base = Image.new("RGB", (w, h), "#f2ead7")
    noise = Image.effect_noise((w, h), 11).convert("L")
    grain = ImageOps.colorize(noise, black="#dfcfad", white="#fbf5e6")
    img = Image.blend(base, grain, 0.19)
    draw = ImageDraw.Draw(img)
    rng = random.Random(1968)
    for _ in range(8500):
        x = rng.randrange(w)
        y = rng.randrange(h)
        shade = rng.choice(["#d5c19c", "#eadfca", "#cdbb99", "#f8f1df"])
        r = rng.choice([1, 1, 1, 2])
        draw.ellipse((x, y, x + r, y + r), fill=shade)
    for _ in range(55):
        y = rng.randrange(h)
        col = rng.choice(["#e3d5bb", "#f7efd9", "#d7c8ac"])
        draw.line((0, y, w, y + rng.randrange(-2, 3)), fill=col, width=1)
    img.save(TEXTURE)


def e(text: str) -> str:
    return html.escape(text, quote=False).replace("\n", "<br/>")


def p(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(e(text), style)


def bullets(items: list[str], style: ParagraphStyle, bullet_color=CLAY) -> ListFlowable:
    return ListFlowable(
        [ListItem(p(item, style), bulletColor=bullet_color, leftIndent=8) for item in items],
        bulletType="bullet",
        bulletFontName=FONTS["body_bold"],
        bulletFontSize=7,
        leftIndent=14,
        bulletIndent=2,
        spaceBefore=3,
        spaceAfter=7,
    )


def styles() -> dict[str, ParagraphStyle]:
    ss = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=ss["Title"],
            fontName=FONTS["display"],
            fontSize=31,
            leading=33,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=10,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=ss["Normal"],
            fontName=FONTS["body"],
            fontSize=9.6,
            leading=15,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=14,
        ),
        "smallcaps": ParagraphStyle(
            "smallcaps",
            parent=ss["Normal"],
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=9,
            textColor=CLAY,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "part": ParagraphStyle(
            "part",
            parent=ss["Heading1"],
            fontName=FONTS["display"],
            fontSize=24,
            leading=27,
            textColor=INK,
            alignment=TA_CENTER,
            spaceBefore=90,
            spaceAfter=8,
        ),
        "chapter_number": ParagraphStyle(
            "chapter_number",
            parent=ss["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=CLAY,
            alignment=TA_LEFT,
            spaceAfter=5,
        ),
        "chapter": ParagraphStyle(
            "chapter",
            parent=ss["Heading1"],
            fontName=FONTS["display"],
            fontSize=23,
            leading=25,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=8,
        ),
        "dek": ParagraphStyle(
            "dek",
            parent=ss["Normal"],
            fontName=FONTS["body_italic"],
            fontSize=10.5,
            leading=15,
            textColor=BLUE,
            alignment=TA_LEFT,
            spaceAfter=12,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=ss["Heading2"],
            fontName=FONTS["body_bold"],
            fontSize=10.8,
            leading=13,
            textColor=CLAY,
            spaceBefore=10,
            spaceAfter=4,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=ss["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=OLIVE,
            spaceBefore=8,
            spaceAfter=2,
        ),
        "body": ParagraphStyle(
            "body",
            parent=ss["BodyText"],
            fontName=FONTS["body"],
            fontSize=9.45,
            leading=13.9,
            textColor=INK,
            alignment=TA_JUSTIFY,
            firstLineIndent=13,
            spaceAfter=5.5,
        ),
        "body_no_indent": ParagraphStyle(
            "body_no_indent",
            parent=ss["BodyText"],
            fontName=FONTS["body"],
            fontSize=9.45,
            leading=13.9,
            textColor=INK,
            alignment=TA_JUSTIFY,
            firstLineIndent=0,
            spaceAfter=5.5,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=ss["BodyText"],
            fontName=FONTS["body"],
            fontSize=8.9,
            leading=12.4,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=3,
        ),
        "caption": ParagraphStyle(
            "caption",
            parent=ss["Normal"],
            fontName="Helvetica",
            fontSize=7.25,
            leading=9.2,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceBefore=5,
            spaceAfter=8,
        ),
        "note": ParagraphStyle(
            "note",
            parent=ss["Normal"],
            fontName=FONTS["body"],
            fontSize=8.45,
            leading=12.1,
            textColor=INK,
            alignment=TA_LEFT,
            firstLineIndent=0,
            spaceAfter=4,
        ),
        "right": ParagraphStyle(
            "right",
            parent=ss["Normal"],
            fontName="Helvetica",
            fontSize=7,
            leading=8,
            textColor=MUTED,
            alignment=TA_RIGHT,
        ),
    }


S = styles()


DESIGN_RESEARCH = [
    {
        "source": "Matthew Butterick, Practical Typography",
        "url": "https://practicaltypography.com/",
        "used": "Margins, line length, and hierarchy were treated as reading conditions, not decoration.",
    },
    {
        "source": "Butterick, Page Margins and Line Length",
        "url": "https://practicaltypography.com/page-margins.html",
        "used": "The page uses generous margins and a short, comfortable line, close to a private reading copy.",
    },
    {
        "source": "Pentagram Publications",
        "url": "https://www.pentagram.com/publications",
        "used": "The design borrows the lesson that editorial rhythm needs a steady base and small page-by-page variation.",
    },
    {
        "source": "AIGA 50 Books 50 Covers and Behance editorial galleries",
        "url": "https://50books50covers.secure-platform.com/a/gallery?roundId=323",
        "used": "The reference set pushed the edition toward restraint, warm materials, strong typography, and disciplined image plates.",
    },
    {
        "source": "George Orwell, Politics and the English Language",
        "url": "https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/politics-and-the-english-language/",
        "used": "The prose tries to keep politics concrete, active, and morally visible.",
    },
    {
        "source": "Strunk and White, composition principles",
        "url": "https://www.writingclasses.com/toolbox/tips-masters/strunk-white-11-composition-principles",
        "used": "The summaries use active verbs and cut waste, while keeping enough texture for real reading.",
    },
]


PLATES = [
    {
        "file": "page_7-007.png",
        "caption": "Title page of the scan, the object behind this reading edition.",
    },
    {
        "file": "page_76-076.png",
        "caption": "Map of provinces and principal towns, useful for following Hudson’s core against hinterland argument.",
    },
    {
        "file": "page_132-132.png",
        "caption": "Map of insurgent areas during the 1958 crisis, where foreign policy, sect, region, and class begin to fuse.",
    },
    {
        "file": "page_44-044.png",
        "caption": "Early political cartoon on the President and the sectarian arithmetic of office.",
    },
    {
        "file": "page_238-238.png",
        "caption": "Cartoon on changing the Cabinet and Chamber, Hudson’s visual shorthand for managed instability.",
    },
    {
        "file": "page_336-336.png",
        "caption": "Cartoon on administrative reform, where Chehab’s state runs into the old bureaucracy.",
    },
    {
        "file": "page_347-347.png",
        "caption": "A final cartoon on presidential choice, a fitting image for the book’s closing problem.",
    },
]


ESSENCE = [
    "Hudson’s Lebanon is not a failed state in embryo. In 1968, writing from Cornell and Beirut archives, he sees a state that works by turning weakness into technique.",
    "The Republic survives because its institutions are too weak to crush the old communities and strong enough to keep them inside one room. Parliament, cabinet changes, sectarian quotas, list elections, and presidential mediation are crude instruments, but they keep the notables negotiating.",
    "The danger is that the same instruments that preserve peace also block reform. The poor South, the Biqa, Tripoli, Beirut’s edges, new university graduates, workers, radicals, and non-Christian communities ask more from the state than the old bargain can easily provide.",
    "Chehab is Hudson’s great test case. He tries to make the Lebanese state larger, fairer, more administrative, more planned, more responsive to rural deprivation. He also brings the army and presidential agents into politics. The cure carries its own fever.",
    "The whole book ends with a cold question. Are Lebanon’s political capacities growing faster than the pressures upon them? Hudson’s answer is guarded and dark. He admires the ingenuity of the system, then sees the storm coming.",
]


CHAPTERS = [
    {
        "number": "Introduction",
        "title": "A State That Survives by Balance",
        "pages": "PDF pp. 23-33",
        "dek": "Hudson begins with the Lebanese paradox: an archaic, corrupt, sectarian republic that still manages to be liberal, parliamentary, commercially alive, and unexpectedly durable.",
        "summary": [
            "Hudson’s opening problem is Beirut in the mid-1960s, a city whose newspapers, banks, ministries, hotels, and private schools suggest political sophistication, while the countryside and the cabinet lists reveal a much older order. The question is simple and severe: how has independent Lebanon lasted since 1943, and what kind of future can such a state reasonably expect?",
            "His answer turns on balance. Lebanon is a balance-of-power system placed inside a sovereign state. Maronites, Sunnites, Shiites, Druzes, Greek Orthodox, Greek Catholics, Armenians, landlords, bankers, lawyers, radical parties, foreign embassies, and presidents all check one another. No actor can easily dominate. No actor feels fully secure. This insecurity is the republic’s nervous system.",
            "The book’s main measure is the relation between political capabilities and social loads. Capabilities are what the state can actually do: govern, tax, plan, represent, arbitrate, repress, bargain, develop. Loads are the pressures placed upon it: sectarian fear, regional inequality, urban growth, Arab nationalism, Western influence, poverty, education, migration, class anger, and war around Lebanon’s borders.",
            "Hudson is careful with modernization. He does not treat it as a clean march from old to new. In Beirut and Mount Lebanon, modern schools, banks, newspapers, radios, and universities grow beside family leadership, clerical influence, clientelism, and sectarian arithmetic. The modern thing does not replace the old thing. It sits on top of it, feeds from it, and sometimes sharpens it.",
            "The introduction’s deepest claim is that Lebanon’s democracy is real and defective at the same time. Elections, cabinets, Parliament, and a free press are more than window dressing. They are working devices for absorbing conflict. Yet they also keep power in the hands of families and blocs that cannot easily produce social justice or a coherent development program.",
        ],
        "subsections": [
            ("The paradox", "Lebanon looks fragile because it is fragmented, but its fragmentation has been organized into a rough political method."),
            ("The method", "Hudson studies the republic through capabilities and loads, asking whether the state can absorb the pressures created by its own society and region."),
            ("The warning", "Democratic balance can preserve order, but the system may become too slow and too narrow for a mobilized country."),
        ],
        "takeaway": "The introduction gives the reader the book’s governing image: Lebanon as a small republic kept upright by an exhausting ritual of balance.",
    },
    {
        "number": "Chapter 1",
        "title": "Obstacles to National Integration",
        "pages": "PDF pp. 37-72",
        "dek": "This chapter explains why Lebanese unity is never merely administrative. It must pass through family, sect, foreign patronage, and the memory of 1860, 1920, and 1943.",
        "summary": [
            "Charles Helou gives Hudson the chapter’s moral formula: in a country of almost equal minorities, peace must be consented to, and consent depends on equilibrium. Hudson accepts the force of that argument before showing its cost. Lebanon cannot be governed as if its citizens first meet one another as abstract individuals. They arrive through village, family, sect, patron, school, newspaper, and foreign connection.",
            "The first obstacle is parochialism. Hudson starts with political cliques, especially extended families and old houses whose influence survived the French Mandate and independence. Chehabs, Arslans, Jumblats, Khazens, Frangiehs, Karams, Skafs, Assaads, Osseirans, and Hamadehs are not decorative names in his account. They are mechanisms. They deliver votes, favors, jobs, protection, and intimidation.",
            "Sect is the second and deeper obstacle. Hudson treats the sects less as theological communities than as security communities. Maronites remember refuge, French protection, Rome, and 1860. Sunnites carry the Ottoman and Arab frame and often feel that Greater Lebanon cut them away from a larger Syrian or Arab political body. Shiites, concentrated in the South and the Biqa, are poorer and tied to landlord structures, though new leaders are beginning to rise. Druzes are few but politically potent, especially through Jumblat and Arslan. Greek Orthodox and Greek Catholics occupy different urban, commercial, and cultural positions. Armenians remain the most recent Christian refuge group, organized and guarded.",
            "The 1932 census hangs over the chapter like an old ledger nobody wants reopened. Its six-to-five Christian to Muslim and Druze ratio becomes the basis for parliamentary seats and state offices. The President is Maronite, the Prime Minister Sunnite, the Speaker Shiite, with other posts distributed by sectarian arithmetic. Hudson concedes the force of the opposing case: abolishing the formula too quickly could produce panic. Then he presses through it. A formula built to calm fear also preserves fear.",
            "Foreign involvement is not an outside accident in this story. France, Britain, Russia, the Ottomans, missionaries, consuls, and later Arab states all help shape Lebanese political identities. The 1861 regime in Mount Lebanon, the 1920 creation of Greater Lebanon, and the French Mandate give Christians protection and Muslims resentment in unequal doses. Lebanon is born with international hands on its cradle.",
            "Hudson’s treatment of Arab nationalism is especially important. Beirut and the missionary schools help make the Arab cultural renaissance possible, yet the new Lebanese state separates Sunnite and Arab nationalist feeling from the Syrian interior. The King-Crane recommendation for autonomy inside Syria is ignored. San Remo and French state-building harden a border that many Muslims experience as imposed.",
            "The National Pact of 1943 is Hudson’s central compromise. Bechara al-Khoury and Riad Sulh agree that Christians will not seek Western protection and Muslims will not seek union with a wider Arab or Islamic state. Lebanon will be independent, sovereign, Arab in face, and distinct in body. The French arrest of Lebanese leaders in November 1943 gives the Pact a national baptism. The Patriarch, Mufti, Kataeb, Najjadeh, and notables converge against France. Independence becomes real.",
            "Yet Hudson’s final judgment is sober. The National Pact is defective and indispensable. It lowers the immediate temperature, recruits Muslim notables, and gives Christians reassurance. It does not create a deep civic spirit, and it freezes sectarian political office while promising one day to abolish sectarianism. Lebanon’s unity is therefore consented, conditional, and always under review.",
        ],
        "subsections": [
            ("Political cliques", "Family and patronage are the first working institutions of Lebanese politics, often stronger than ministries."),
            ("Sectarian cleavages", "Sects work as political shelters, with their own fears, memories, institutions, and claims to security."),
            ("External influence", "Foreign protection and regional ambition intensify Lebanese fragmentation rather than simply acting upon it from outside."),
            ("The National Pact", "The 1943 bargain stabilizes the republic by asking Christians and Muslims to renounce opposite external saviors."),
        ],
        "takeaway": "Chapter 1 shows that Lebanese national integration is a bargain among frightened communities, not a settled feeling.",
    },
    {
        "number": "Chapter 2",
        "title": "Social Mobilization in Lebanon",
        "pages": "PDF pp. 73-106",
        "dek": "Hudson turns from inherited division to movement: roads, radios, banks, schools, cities, cinema, migration, and a country learning to want more from politics.",
        "summary": [
            "Hudson’s Lebanon in Chapter 2 is noisy, crowded, and moving. Beirut grows upward and outward. The mountains fill with summer visitors. Cars, telephones, radios, cinemas, newspapers, universities, banks, and construction sites spread new appetites through a country whose political structure still depends on old bargains. Social mobilization is the name Hudson gives to this awakening.",
            "Demography is the first pressure. Lebanon avoids a new census after 1932 because a real count could wreck the Christian-Muslim ratio on which the state rests. Hudson notes the evidence that Muslims are growing faster than Christians, while Christians adopted smaller-family patterns earlier. The population moves from roughly 756,000 in 1932 to more than 2 million by 1963, and around 70 percent are under thirty-five. A young country presses against an elderly political style.",
            "Migration changes the map without dissolving old loyalties. Greater Beirut reaches about 800,000 in 1963, near 40 percent of the population. Bourj Hammoud, with perhaps 125,000 people, carries the weight of Armenian survival and urban poverty. Rural migrants bring village, sect, and patronage with them. The city does not melt these identities. It crowds them together.",
            "Emigration, once Lebanon’s safety valve, is narrowing because of restrictions in Africa and Latin America. Palestinian refugees, more than 100,000 by the late 1950s and early 1960s, add another human and political load. Hudson’s language is cooler than ours might be after Gaza, Sabra, and decades of dispossession, but his point is clear enough: Palestinian suffering comes from outside Lebanon and then becomes part of Lebanon’s internal pressure system.",
            "Economically, Lebanon grows rich in a way that leaves many Lebanese poor. Banking explodes from five banks before 1951 to ninety-three by 1966. Trade, tourism, oil transit, finance, and secrecy laws make Beirut gleam. Yet half the population is poor or destitute in Hudson’s figures, agriculture employs about half the workforce while producing a small share of national income, and finance produces a large share with a tiny workforce. The free economy creates charm, profit, and resentment.",
            "Regional inequality gives the chapter its Lebanese geography. Beirut and Mount Lebanon pull ahead. The North, South, and Biqa remain underdeveloped, with worse schools, fewer services, poorer roads, and fewer chances. The danger is not poverty alone. It is poverty after radio, school, cinema, newspaper, and military spectacle have taught people to compare.",
            "Exposure to modernity spreads quickly. By 1963, Hudson says, the radio reaches nearly everyone, and a villager in the Biqa may hear Cairo, Damascus, Moscow, Washington, London, and Beirut in the same week. Lebanon’s press is overgrown for its size, with hundreds of publications. Cinema attendance is extremely high. Television spreads. Literacy rises, though unevenly by region, sect, and gender. Schools and universities swell.",
            "Hudson’s summary is double-edged. Social mobilization can make citizens more tolerant, informed, and civic. It can also produce anger among educated young people who cannot find dignified work, poor migrants who see the wealth they are denied, and rural communities that feel Beirut’s contempt. Modernization does not soothe Lebanon. It teaches Lebanon how unequal it is.",
        ],
        "subsections": [
            ("Demographic trends", "Population growth, youth, migration, and the refusal to hold a new census strain the old sectarian formula."),
            ("Economic trends", "Finance and services make Beirut prosperous while agriculture and industry remain too weak to absorb the country’s people."),
            ("Exposure to modernity", "Radio, newspapers, schools, cinema, cars, telephones, and universities spread comparison faster than reform."),
            ("Regional split", "The core around Beirut and Mount Lebanon races ahead of the North, South, and Biqa, where political resentment thickens."),
        ],
        "takeaway": "Chapter 2 turns modernization into a pressure cooker. Lebanon is getting richer, louder, better educated, and less willing to wait.",
    },
    {
        "number": "Chapter 3",
        "title": "Lebanon’s Political Dilemma",
        "pages": "PDF pp. 107-142",
        "dek": "The old balancing system handles fragmentation. The new society asks for action. This is the trap.",
        "summary": [
            "Chapter 3 is where Hudson’s argument hardens. National integration requires balance, and social mobilization requires policy, development, inclusion, and administration. The same mechanisms that keep the sects from panic also keep the state from acting with force and speed. Lebanon needs movement from a system built to prevent sudden movement.",
            "Sectarian suspicion is never far from the surface. Hudson tracks incidents in 1953, 1954, 1958, 1965, and 1966, from Sunnite demands over administration to pamphlet scandals, Tripoli protests, and controversies around schools and religion. Students and younger activists are involved, which matters. Sectarian fear is being modernized too. It is carried by people with newspapers, campuses, parties, and slogans.",
            "The state has defenses: sectarian formulas, mediation by notables, censorship, police action, and social justice policies meant to prove impartiality. Hudson grants the practical case for these devices. Without them, panic could spread quickly. But they cannot create belonging. They manage suspicion while leaving the structure of suspicion intact.",
            "External pressure is the second strain. Lebanon faces Israel, Syria, the Mediterranean, the United States, France, Britain, Egypt, and later the Soviet shadow through the Arab Cold War. Embassies fund newspapers and candidates. Syria can close the border. Nasser can ignite a street. The Sixth Fleet can reassure one Lebanese and terrify another. Hudson’s Lebanon is a small state with too many radios pointed at it.",
            "Socioeconomic tension supplies the third pressure. A new educated stratum, especially ages twelve to thirty-five, gathers in Greater Beirut and expects work, dignity, and public meaning. Radical organizations recruit from this world. The uneducated poor, especially in the North, South, and Biqa, face unemployment and rising prices with fewer words but no less anger.",
            "The 1952 crisis shows the limits of legality without legitimacy. Bechara al-Khoury amends the Constitution to renew his term after the corrupted 1947 elections. Opposition gathers from Jumblat’s Socialist National Front, regional notables, editors, the National Bloc, the Kataeb, Najjadeh, and others. Corruption, unemployment, strikes, and administrative failure converge. General Fuad Chehab refuses to use the army to save Khoury. The President resigns.",
            "The 1958 crisis is far more violent. Chamoun’s suspected wish for a second term matters, but Hudson insists that foreign orientation is the hotter wire. Suez, the Eisenhower Doctrine, the Baghdad Pact, Nasserism, the United Arab Republic, and Chamoun’s Western leaning make Lebanese neutrality feel broken to many Muslims and Arab nationalists. The July 14, 1958 revolution in Iraq helps trigger the American landing in Beirut on July 15.",
            "Hudson refuses a simple class explanation of 1958. Loyalists include conservative Christian Mount Lebanon, business circles, middle-class groups, Kataeb, and P.P.S. elements. Insurgents include poor regions, radical students, Arab nationalists, Baathists, communists, and rural bosses. Class matters, but sect, foreign policy, region, personal rivalry, and ideology matter too. The Lebanese crisis is never one thing.",
            "The settlement gives Lebanon the famous formula, no victor, no vanquished, and brings Chehab to the Presidency. Hudson’s conclusion is bleak. Sectarianism has substituted for deeper consensus, and the presidency is being pushed to grow stronger because the other institutions cannot carry the load. More crises are likely because the sources of pressure remain alive.",
        ],
        "subsections": [
            ("Sectarian suspicions", "Incidents over office, religion, schools, pamphlets, and foreign alignments show how quickly security fears return."),
            ("External pressures", "Lebanon’s foreign policy is internal politics by another road, especially after Suez and the rise of Nasser."),
            ("Socioeconomic tensions", "Educated youth and poor regions become the human base for opposition to the old system."),
            ("The 1952 crisis", "Khoury falls because formal legality cannot protect a regime stripped of social legitimacy."),
            ("The 1958 crisis", "Chamoun’s Lebanon breaks under the combined weight of Arab Cold War politics, presidential ambition, regional inequality, and sectarian fear."),
        ],
        "takeaway": "Chapter 3 gives the book its engine: the system must change to survive, but every attempt at change threatens the balance that keeps it alive.",
    },
    {
        "number": "Chapter 4",
        "title": "The Establishment and Its Politics",
        "pages": "PDF pp. 145-187",
        "dek": "Hudson enters the drawing rooms, patriarchates, family houses, banks, law offices, and party offices where the republic’s old managers bargain over the state.",
        "summary": [
            "The establishment is Hudson’s name for the people who can usually enter the state without knocking. They are clerics, semifeudal landlords, bankers, businessmen, lawyers, and political families. Fewer than fifty families dominate much of this world. Their politics are cliquish, personal, regional, sectarian, and practical. They do not always govern well, but they know how to keep one another from total defeat.",
            "The clerics matter because Lebanon’s sects are corporate communities. The Maronite Patriarch is central to the creation of Greater Lebanon and remains powerful after independence. Patriarch Meouchy opposes Chamoun and later Chehab in different ways. Bkerke is not just a religious seat in Hudson’s account. It is a political station, especially when Maronite security seems at stake.",
            "The landlords supply another layer of power. Joseph Skaf in Zahleh, Ahmad al-Assaad and Kamel al-Assaad in the South, Sabri Hamadeh in the Biqa, the Frangiehs and Karamis in the North, the Jumblats and Arslans in the Chouf, and other local houses command followers, favors, and loyalties. Saeb Salam, the Beirut notable, is Hudson’s best example of a man who can speak the language of reform while still moving through a politics of service, clientele, and balance.",
            "Lawyers and businessmen are the Mandate’s more modern establishment. Michel Chiha, Emile Edde, Bechara al-Khoury, Camille Chamoun, Henri Pharaon, Khatchik Babikian, and others show how law, finance, diplomacy, newspapers, and communal bargaining form a ruling style. Pharaon, a Greek Catholic banker, becomes a mediator of balance. Babikian, through the Armenian Tashnaq, speaks for a disciplined minority whose demand for security makes it loyal to state order.",
            "The Kataeb receives extended treatment because it is the establishment’s closest thing to a modern party. Founded in 1936 by Pierre Gemayel and Christian colleagues, it combines organization, discipline, symbols, youth mobilization, paramilitary habits, welfare language, and Lebanese nationalism. It helps in 1943, fights with Chamoun and the P.P.S. in 1958, then gains a cabinet place and more influence under Chehab.",
            "Hudson concedes the Kataeb’s organizational seriousness and social program. He also sees the limit. Its slogan of Lebanon first cannot escape Christian weight in Muslim eyes. It claims to reject sectarianism, yet it wants emigrants counted, defends Christian ratios, and functions as a Christian deterrent in moments of fear. It is modern in form and sectarian in political effect.",
            "The chapter then moves through the three regimes. Khoury uses Riad Sulh, Henri Pharaon, Majid Arslan, Ahmad al-Assaad, and cabinet rotation to consolidate independence. Chamoun tries to weaken old pluralism through redistricting and presidential power, then helps produce the 1958 breakdown. Chehab restores normal politics after 1958 while building technocratic and military channels beside the notables.",
            "Hudson’s establishment is easy to despise and hard to dismiss. It is corrupt, narrow, self-protective, and often socially blind. It also contains the country’s old conflicts inside rituals of rivalry. Its tragedy is that it can manage itself more skillfully than it can govern a changing country.",
        ],
        "subsections": [
            ("Clerics", "Religious leadership is part of political security, especially for Maronites after 1860, 1920, and 1943."),
            ("Landlords and bosses", "Local houses turn land, family, money, and service into parliamentary power."),
            ("Lawyers and businessmen", "The Mandate elite brings legal and financial sophistication into the same old bargaining culture."),
            ("Kataeb", "Pierre Gemayel’s party modernizes Christian mobilization while deepening Muslim suspicion of Christian political organization."),
            ("Factional patterns", "Khoury exploits the old balance, Chamoun tries to dominate it, Chehab works around it."),
        ],
        "takeaway": "Chapter 4 shows why the establishment is both Lebanon’s shock absorber and one of the reasons the shocks keep coming.",
    },
    {
        "number": "Chapter 5",
        "title": "The Radical Outsiders",
        "pages": "PDF pp. 188-228",
        "dek": "Outside the establishment stand parties that want a different Lebanon, or a Lebanon absorbed into something larger, more Arab, more Syrian, more Islamic, more socialist, or more disciplined.",
        "summary": [
            "Hudson’s radical outsiders are the counterelite. They are excluded from normal power, often treated as foreign agents, and sometimes behave in ways that confirm establishment fear. Yet they also express real failures of the republic: its social injustice, its sectarian narrowness, its cowardice before poverty, and its unresolved place in the Arab world.",
            "On the radical right, the P.P.S., or Syrian National Party, is the most dramatic. Antoun Saadeh founds it in the 1930s with a vision of a natural Syria from the Taurus to the Suez and Iraq’s edge. Its organization is secretive, disciplined, paramilitary, and hostile to sectarian Lebanon. It appeals strongly to some Greek Orthodox, Protestants, Druzes, and Shiites, while alarming Maronites and Sunnites for different reasons.",
            "Saadeh’s return in 1947 and execution in July 1949 make the P.P.S. both martyrized and feared. The party assassinates Riad Sulh in Amman in 1951, then later finds space under Chamoun because its anti-Nasser, anti-communist force can be useful. Its failed coup of December 31, 1961, after it kidnaps officers close to Chehab, hardens the army and helps justify deeper surveillance.",
            "The Najjadeh is the Islamic counterpart in Hudson’s radical right. Founded in 1936 by Muhieddine Nsouli and later led by Adnan Hakim, it carries a Sunnite and Arab-Islamic mobilizing memory. Ramadan Lawand’s thought imagines cultural resurrection against Western domination and Christian privilege. The party supports a new census, social security, Chehabist rural reform, and Nasserist feeling, but it remains limited by rival Islamic and Arab nationalist groups.",
            "Hudson also notes smaller Islamic currents, including Ubad al-Rahman, Jamaah Islamiyyah, the Muslim Brotherhood, and the Liberation Party. He is writing before the later decades of Islamist politics, but he sees the mosque and religious network as possible routes of political mobilization where the parliamentary system gives little access.",
            "On the left, the Communists are older and weaker than establishment fears suggest. Lebanese communism begins in the 1920s, works through labor, shifts through legal and underground periods, and is hit by repression, Nasser’s anti-communism, and Baathist competition. By the mid-1960s, Hudson sees perhaps a few thousand members and a union base, with long-run hopes tied to inequality and worker unrest.",
            "Kamal Jumblat and the Progressive Socialist Party are the chapter’s most Lebanese contradiction. Jumblat is a Druze chieftain from Moukhtara, a Sorbonne and Jesuit-educated aristocrat, a socialist, an ascetic, a moralist, a tactician, and a man whose personal authority makes party-building difficult. Hudson calls the paradox clearly: a feudal socialist can speak social justice with uncommon force while remaining embedded in a house, a mountain, and a sect.",
            "The Arab Nationalist Movement grows around Palestine, AUB circles, Beirut clubs, Saida, coastal towns, and the camps. Its language is unity, freedom, socialism, and Nasserist identification. It attacks banks, speculation, false prosperity, and low social investment. It wants planning, nationalization of banks, development, health programs, and a foreign policy aligned with the liberated Arab states.",
            "The Baath shares the language of unity, freedom, and socialism but is more ideological, shaped by Michel Aflaq’s thought and tied to a transnational party structure. In Lebanon it competes with Nasserists, communists, and Jumblatists. It rejects Lebanon’s special status more sharply than most domestic actors can bear. Its strength rises and falls with regional Arab ruptures.",
            "Hudson ends with the problem of organizing the left. Jumblat tries front after front: the Socialist National Front, the National Front, the Labor Liberation Front. Each runs into mistrust, prosperity’s distractions, moderate fear of radicalism, and the lack of a responsible route into power. The republic needs a left that can be included. The establishment fears the left too much to make inclusion easy.",
        ],
        "subsections": [
            ("P.P.S.", "Antoun Saadeh’s party attacks sectarian Lebanon from a Greater Syrian, disciplined, secular-nationalist position."),
            ("Najjadeh and Islamic groups", "Sunnite and Islamic organizations answer Christian party formation, Christian privilege, and Arab-Islamic grievance."),
            ("Communists", "Lebanese communism is persistent, limited, factional, and tied to labor and inequality more than electoral strength."),
            ("Jumblat and the PSP", "Kamal Jumblat gives social justice a Lebanese aristocratic face, with all the brilliance and contradiction that implies."),
            ("Arab Nationalists and Baathists", "Palestine, Nasser, Syria, and Arab unity generate parties that the Lebanese state cannot easily absorb."),
        ],
        "takeaway": "Chapter 5 shows that the outsiders are dangerous partly because the system gives them no honorable place to become insiders.",
    },
    {
        "number": "Chapter 6",
        "title": "Trends in Representation",
        "pages": "PDF pp. 231-281",
        "dek": "The elections work badly. That is part of why they work at all.",
        "summary": [
            "Hudson opens Chapter 6 with one of the book’s sharpest insights: Lebanon survives because its representative institutions function, but they do not function too well. If they were absent, primordial conflict might tear the republic apart. If they fully represented every tendency and intensity in Lebanese politics, national life could become chaotic. Their restriction is part of their stabilizing effect.",
            "The electoral mechanism rests on sectarian quotas, regional allotments, and the list system. A powerful notable from the majority community in a district builds a list with candidates from minority communities, each delivering a pocket of votes. This creates coattails across sects. In Jbeil, North Lebanon, South Lebanon, the Biqa, and the Chouf, minorities become politically valuable because lists need them.",
            "Hudson gives the strongest case for the list system before judging it. It forces organization in the absence of parties, and it encourages sectarian moderation because candidates need votes beyond their own community. Druzes and Christians in southern Mount Lebanon, Sunnites in parts of the Biqa, Shiites in Jbeil, Greek Orthodox in the North, and Christians in the South all become electoral hostages and bargaining partners.",
            "The cost is equally serious. The list system reinforces the notables, blocks new political movements, and preserves sectarian identity by exploiting sectarian fear. It gives Lebanon tranquility, charm, and a kind of security in the 1960s. It also keeps the republic from developing a more positive national unity.",
            "Parliament grows without changing its ratios. Christian and non-Christian seats remain locked at six to five, rooted in the old 1932 count. Presidents enlarge the Chamber for practical reasons, Khoury in 1951, Chamoun through his redistricting experiments, Chehab after 1958. Each expansion gives more places to factions and new respectable elements while preserving the sectarian arithmetic.",
            "Voting participation rises dramatically after the 1952 electoral law gives women the vote, makes voting compulsory for men, and introduces the secret ballot. Between 1943 and 1964, the number of voters grows more than fourfold. The strange pattern is regional: the North, South, and Biqa show rapid increases, while Beirut performs poorly. The hinterland is waking politically, and the capital contains many mobilized people who do not enter elections in the normal way.",
            "Competitiveness increases after the corrupt 1947 elections. Hudson’s calculations show more close races, more opposition, and a national mean around 60 percent for winners after 1951. This is healthy in one sense: deputies cannot ignore constituencies. Yet competition does not necessarily mean programmatic choice. Many contests remain battles among notables, clienteles, and lists.",
            "Organizational development is mixed. The number of electoral groups rises sharply from 1943 to 1964, but fragmentation grows faster than institution-building. Parties appear more often, especially in Beirut and Mount Lebanon, yet few break through. The Communists fail to win seats. The P.P.S. enters late and unevenly. The Kataeb wins from 1953 onward. Tashnaq is the most consistent party success because Armenian communal organization gives it discipline.",
            "Parliament’s membership changes and does not change. New-entry rates are high, but veterans monopolize important positions. Deputies are usually older, male, university educated, bilingual, often trained in law, and tied to traditional blocs. Landlords decline in relative weight, professionals rise, and non-Christian access broadens after 1958. Women, workers, peasants, small farmers, and lower-income people remain almost absent.",
            "Hudson’s strongest criticism is that Parliament badly represents the political element of society. Educated, modern, reformist figures cannot enter easily without a rich patron, a traditional list, or a sectarian machine. His examples, a young Druze professor in Aley in 1960 and a modern Sunnite progressive in Beirut in 1964, show intelligent candidates crushed by Arslan, Jumblat, Sami Sulh, Adnan Hakim, and the logic of alliances.",
            "Corruption and coercion are not marginal. Vote buying, official interference, intimidation, arrests, forged identity cards, ballot manipulation, hired transport, street violence, and even murder recur. The 1947 elections are Hudson’s classic scandal. The 1957 elections take place under strong government pressure. Under Chehab, army involvement becomes the new concern. Corruption may help regimes manage rivals, but it poisons legitimacy.",
            "Campaign costs close the circle. A candidate’s deposit and expenses are enormous compared with income levels in the early 1960s. Without a party that can pay, a new professional or poor candidate has almost no chance. Lebanon’s elections therefore absorb conflict while excluding many of the people most capable of turning new social pressures into responsible politics.",
        ],
        "subsections": [
            ("The electoral mechanism", "Sectarian and regional quotas make lists necessary, and lists turn minorities into electoral partners."),
            ("Popular involvement", "More Lebanese vote after 1952, especially in the rural and poorer regions, while Beirut’s participation remains troublingly low."),
            ("Competitiveness", "More races become real contests, but the choices remain mostly personal, sectarian, and local."),
            ("Organizational development", "Groups multiply faster than strong parties, leaving fragmentation without enough institution-building."),
            ("Parliamentary membership", "The Chamber grows somewhat more professional and less landed, yet stays elite, male, expensive, and old in outlook."),
            ("Barriers", "Organized outsiders, honest new candidates, and lower-income citizens face corruption, coercion, and campaign costs that keep them at the door."),
        ],
        "takeaway": "Chapter 6 is Hudson at his most exact: Lebanese elections stabilize the republic by representing the old country better than the new one.",
    },
    {
        "number": "Chapter 7",
        "title": "Presidential Power: The Struggle to Dominate",
        "pages": "PDF pp. 282-316",
        "dek": "The President is the republic’s strongest instrument and its most dangerous temptation.",
        "summary": [
            "Chapter 7 turns the whole argument toward the Presidency. Hudson’s claim is harsh and persuasive. Lebanon needs a strong President because parties, Parliament, bureaucracy, and local government are too weak to govern a changing country. Yet a strong President threatens the pluralism that keeps Lebanon from rupture. Every President is accused of weakness and dictatorship, sometimes by the same people.",
            "Hudson identifies three presidential strategies. Presidents enlarge the administration, using patronage and services to bargain with local power. They build coalitions among notables. They also bypass notables by recruiting professionals, nonparliamentarians, organized groups, and ordinary citizens. Each strategy increases the state’s capacity and the President’s power, which in Lebanon can quickly look like domination.",
            "Bechara al-Khoury’s task after 1943 is consolidation. He begins with little army, a rudimentary administration, French residue, inflation, wheat shortages, labor unrest, and a fragile independence. His genius is cabinet management. By rotating portfolios among Riad Sulh, Henri Pharaon, Majid Arslan, Ahmad al-Assaad, Sami Sulh, Abdallah Yafi, and others, he gives notables a stake in the state and keeps them too off-balance to unite against him.",
            "Hudson concedes that the cabinet system looks absurd by ordinary standards. Thirty-six governments between 1943 and 1965 suggest instability, weak prime ministers, poor technical leadership, and shallow responsibility. Yet in Khoury’s hands cabinet change becomes a peace machine. It institutionalizes rivalry, buys time, protects the President, and makes the new state feel worth entering for local chiefs.",
            "Riad Sulh is essential. With Sulh beside Khoury, Sunnites feel represented by a serious Arab nationalist, and the National Pact has living force. When Khoury separates from Sulh and Sulh is assassinated in July 1951, Khoury’s protection among Sunnite masses erodes. Corruption, exclusion, and factional fatigue then leave him exposed. Fourteen months later, he is gone.",
            "Camille Chamoun inherits the Presidency in 1952 with reformist support, then loses both reformers and traditional politicians. Hudson portrays him as a fighter, a diplomat, a brilliant tactician, and finally a man whose ambition and foreign orientation outrun Lebanon’s balance. He can play cabinet politics, but the opposition now includes socialists, Arab nationalists, Nasserists, Islamic groups, old Destourians, and notables with wounded pride.",
            "Chamoun’s early reform efforts under Khaled Chehab are energetic on paper. Decree laws reform administration, judiciary, press, elections, and women’s suffrage. Yet the excluded notables circle the cabinet, Sunnite groups demand posts, sectarian disputes flare, and reform becomes another arena of rivalry. Hudson’s lesson is sharp: reform without politicians is difficult, and government without politicians is impossible.",
            "Foreign policy consumes Chamoun. The Baghdad Pact, Egypt, Syria, Iraq, Britain, the United States, the Soviet-Egyptian arms deal, and Israel’s raids make neutrality nearly impossible. Chamoun leans toward the West because he fears Nasser’s regional dominance and values Lebanon’s Western ties. Many Muslims and Arab nationalists read that leaning as a violation of the National Pact.",
            "The Suez crisis of 1956 lets Chamoun display tactical skill. He supports Egypt’s sovereignty over the Canal, calls an Arab heads-of-state conference in Beirut, avoids an isolated break with Britain and France, and briefly neutralizes the pro-Cairo opposition. Saeb Salam and Abdallah Yafi still resign, accusing the regime of dishonor. Chamoun wins the short game, but the long game moves toward 1958.",
            "Hudson’s judgment on Chamoun is one of tragic failure. He enlarges the Presidency and gives it energy, but he never builds a solid universal base. After 1957 his electoral tactics, foreign policy, and suspected second-term ambition make presidential dynamism look like authoritarian threat. The office grows because Lebanon needs action. It becomes dangerous because the action has no trusted national foundation.",
        ],
        "subsections": [
            ("The presidential dilemma", "Lebanon requires executive strength, yet executive strength can break the balance it is meant to guard."),
            ("Khoury", "Cabinet change becomes a method for consolidating independence and domesticating the notables."),
            ("Khoury and Riad Sulh", "The partnership gives the National Pact its most effective human form."),
            ("Chamoun and reform", "Administrative reform gains decree laws but loses political shelter."),
            ("Chamoun and foreign pressure", "The Arab Cold War turns Lebanese foreign policy into a domestic battlefield."),
            ("Suez and after", "Chamoun handles 1956 with agility, then slides toward the 1958 disaster because tactical success is not the same as national trust."),
        ],
        "takeaway": "Chapter 7 shows the Presidency becoming the engine of the republic because every other engine is too weak, and that is precisely why it can overheat.",
    },
    {
        "number": "Chapter 8",
        "title": "Presidential Power: The Attempt to Modernize",
        "pages": "PDF pp. 317-356",
        "dek": "Chehab tries to build a state large enough to hold Lebanon together. Hudson admires the effort and keeps his eyes open.",
        "summary": [
            "The 1958 crisis brings General Fuad Chehab to the Presidency on July 31, 1958, by a vote of forty-eight to seven. He is unlike Khoury and Chamoun: a soldier, reserved, methodical, disdainful of ordinary political bargaining, respected by officers, and trusted by many radicals because he seems honest and orderly. Hudson treats Chehab as Lebanon’s great modernizing experiment.",
            "Chehab’s new style rests on three moves. He circumvents traditional politics without abolishing it. He draws in professionals, army men, and new administrators loyal to the Presidency. He expands and reforms the state on a scale no predecessor attempted. He also gives Lebanon a moderate welfare doctrine, Chehabism, which tries to answer radical demands for social justice without abandoning free enterprise or sectarian balance.",
            "The early cabinets show how careful and hard the work is. Chehab’s first postwar cabinet excludes Chamounists and provokes renewed fighting after the kidnapping and apparent murder of a Kataeb journalist. His second cabinet includes Raymond Edde and Pierre Gemayel alongside Hussein Oueini and Rashid Karami. Emergency powers restore order. By 1960, Chehab expands Parliament, lets factions breathe, and then theatrically resigns on July 20, forcing the political class to plead for his return.",
            "Chehab builds a majority that includes the Kataeb, Tashnaq, the Assaad bloc, Jumblat’s PSP, the Destour, Sunnite notables, Sleiman Frangieh, René Moawad, Fuad Ghusn, Sabri Hamadeh, and others. It is not disciplined, but it is enough. Rashid Karami and Saeb Salam alternate in the premiership, with Karami often closer to Chehab’s reform program. Government lasts longer and runs more smoothly than under Chamoun.",
            "The great innovation is the President’s personal administrative network. Elias Sarkis, Père Louis-Joseph Lebret, Jean Lay, Chafic Muharram, Georges Haimari, young professionals, contracted technicians, and military officers become Chehab’s instruments. This gives the state competence and discipline. It also irritates politicians who see their patronage slipping away.",
            "The army’s role is the chapter’s moral danger. After the failed P.P.S. coup of December 31, 1961, thousands are arrested, passports are revoked, surveillance rises, and opponents complain of intimidation. The 1964 elections carry strong allegations of military pressure, especially against Raymond Edde and Camille Chamoun. Chehabists argue that officers are cleaner than politicians and necessary for reform. Opponents argue that military interference smothers Lebanon’s self-correcting freedoms. Hudson lets both arguments breathe, then shows the tension plainly.",
            "Government expands rapidly. Ordinary budget expenditures rise from about 27.7 million Lebanese pounds in 1944 to 473 million in 1964. Autonomous authorities grow in water, electricity, transport, reconstruction, and development. The army grows. The state moves away from laissez-faire and toward state-led planning, public works, and social policy. After 1958, the state no longer pretends that commerce alone can hold the republic together.",
            "Planning becomes central through IRFED, led by Père Lebret, with French and Lebanese experts surveying needs and proposing long-term, middle-range, national, regional, sectoral, and financial plans. Critics call it a state within a state or Vatican socialism. Hudson sees the political meaning: Chehabist planning tries to use development to build Muslim and rural loyalty to Lebanon, especially in the South, the Biqa, and neglected districts.",
            "Administrative reform comes through the 1959 decree laws: 162 decrees aiming at decentralization, clearer duties, less red tape, better recruitment, stronger control, and less corruption. Early assessments are harsh. L’Orient complains that public services are more disorganized. Experts criticize the rush and lack of real decentralization. Still, the Civil Service Council, National Institute of Public Administration, Court of Accounts, Central Inspection Agency, and stronger Prime Minister’s office improve the state’s machinery.",
            "Chehab’s programs give the chapter its concrete social face. Roads, water, electricity, Beirut redevelopment, the Litani project, the National Reconstruction Authority, and the Office of Social Development reach into areas previously neglected. Public education expands, though private schools still dominate quality and sectarian identity. Curriculum reform runs into the old argument over Arab heritage and Western civilization.",
            "The Green Plan, launched in 1963, tries to reclaim land, terrace fields, provide equipment, and keep farmers from leaving for Beirut. The Central Bank begins in 1964, adding a modern monetary instrument, though the 1966 Intra Bank crisis reveals how limited its authority and confidence still are. Social security, prepared from 1958 and launched in stages in 1965, aims at medical, maternity, accident, family, and end-of-service benefits. Everyone says Lebanon needs it. Many doubt the state can run it honestly.",
            "The chapter closes with Charles Helou and the future. Helou is qualified, moderate, and elected in an unusually orderly 1964 succession. Yet he lacks a base, and the loads grow: rural development, urban facilities, housing, taxation, jobs, sectarian balance, Arab Cold War pressures, financial crisis, and the 1967 Arab-Israeli war. Hudson’s final proposal is a country-wide left-of-center social-democratic party, explicitly multisectarian, able to bring educated reformists and poor regions into legitimate politics. He knows it is difficult. He thinks the alternative is worse.",
            "Hudson’s closing sentence is stormy in spirit. Lebanon’s capacities have grown. Its democracy has performed better than anyone had a right to expect. But parochialism is sharpened by social change, the productive economy is weak, radicalism has no responsible home, Arab rivalries and Great Power competition keep reaching into Beirut, and the loads appear to be growing faster than the state’s ability to carry them.",
        ],
        "subsections": [
            ("A new political style", "Chehab’s military distance from normal politics becomes a source of authority after 1958."),
            ("The President’s network", "Professionals, advisers, technicians, and officers give reform a machinery outside Parliament."),
            ("The army question", "Military discipline helps state-building and threatens Lebanese liberal correction at the same time."),
            ("Planning and IRFED", "Development becomes a political answer to rural deprivation and Muslim alienation."),
            ("Administrative reform", "The 1959 reforms are messy, incomplete, and still a real advance in personnel and supervision."),
            ("New programs", "Public works, education, the Litani, the Green Plan, the Central Bank, and social security expand the idea of the Lebanese state."),
            ("Capabilities versus loads", "Helou inherits a larger state and a heavier world, with 1966 and 1967 already showing the limits."),
        ],
        "takeaway": "Chapter 8 is Hudson’s final test: Chehab proves Lebanon can modernize, then proves how hard modernization becomes when every reform disturbs the old balance.",
    },
]


DRAMATIS = [
    ("Bechara al-Khoury", "First President of independent Lebanon, master of cabinet balancing, undone by corruption, exclusion, and the loss of Riad Sulh."),
    ("Riad Sulh", "Sunnite partner of the National Pact, the figure who made Muslim participation feel serious in the early republic."),
    ("Camille Chamoun", "President from 1952 to 1958, energetic, Western-leaning, tactically gifted, and finally trapped by the forces he tried to dominate."),
    ("Fuad Chehab", "Army commander turned President after 1958, the book’s main modernizer and the source of Chehabism."),
    ("Charles Helou", "Chehab’s successor in 1964, a moderate civilian asked to carry a load even Chehab could barely move."),
    ("Kamal Jumblat", "Druze notable, socialist, moralist, and organizer of successive left fronts, both inside and outside the old order."),
    ("Pierre Gemayel", "Founder of the Kataeb, builder of a disciplined Christian party with welfare language and paramilitary force."),
    ("Raymond Edde", "National Bloc leader, critic of army interference, and one of Chehabism’s most visible civilian opponents."),
    ("Saeb Salam", "Beirut Sunnite notable, reform language and client politics in the same body."),
    ("Rashid Karami", "Tripoli Sunnite leader and recurrent Prime Minister, closer than Salam to Chehab’s reform agenda."),
    ("Antoun Saadeh", "Founder of the P.P.S., executed in 1949, whose Greater Syrian movement haunted the republic."),
    ("Père Louis-Joseph Lebret", "French priest and planner whose IRFED mission gave Chehabism its development map."),
]


TIMELINE = [
    ("1860", "Massacres in Mount Lebanon become part of Maronite political memory and European intervention."),
    ("1920", "France creates Greater Lebanon, joining mountain, coast, Biqa, North, and South into a new state frame."),
    ("1932", "The last official census gives the ratio that haunts every later parliamentary and administrative bargain."),
    ("1943", "Khoury and Riad Sulh’s National Pact becomes the formula of independence."),
    ("1947", "The scandal-ridden elections damage Khoury’s legitimacy and become Hudson’s classic case of electoral corruption."),
    ("1952", "Khoury falls after strikes, opposition mobilization, and Chehab’s refusal to use the army for presidential survival."),
    ("1956", "Suez turns Lebanese neutrality into a domestic test of Arab loyalty and Western alignment."),
    ("1958", "Civil war, American landing, and Chehab’s election expose the full dilemma of the republic."),
    ("1961", "The P.P.S. coup attempt hardens the army and gives Chehabist surveillance a new justification."),
    ("1964", "Helou succeeds Chehab in an orderly transfer, but inherits the same structural trap."),
    ("1966", "The Intra Bank crisis shows that Beirut’s prosperity can be thin, nervous, and badly supervised."),
    ("1967", "Israel’s defeat of Syria, Jordan, and Egypt adds new burdens to Lebanon’s foreign policy and internal balance."),
]


def draw_background(canvas, doc):
    canvas.saveState()
    canvas.drawImage(str(TEXTURE), 0, 0, width=PAGE_W, height=PAGE_H, mask=None)
    canvas.setStrokeColor(colors.Color(0.72, 0.60, 0.43, alpha=0.45))
    canvas.setLineWidth(0.35)
    canvas.line(MARGIN_X, PAGE_H - 0.38 * INCH, PAGE_W - MARGIN_X, PAGE_H - 0.38 * INCH)
    if doc.page > 1:
        canvas.setFont("Helvetica", 6.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(MARGIN_X, PAGE_H - 0.31 * INCH, "MICHAEL C. HUDSON, THE PRECARIOUS REPUBLIC")
        canvas.drawRightString(PAGE_W - MARGIN_X, 0.38 * INCH, str(doc.page))
    canvas.restoreState()


def add_rule(story, color=CLAY, width=0.75):
    story.append(Spacer(1, 4))
    story.append(
        Table(
            [[""]],
            colWidths=[PAGE_W - 2 * MARGIN_X],
            rowHeights=[width],
            style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), color)]),
        )
    )
    story.append(Spacer(1, 9))


def add_callout(story, title: str, text: str, fill=PALE_BLUE):
    data = [[p(title.upper(), S["h3"])], [p(text, S["note"])]]
    table = Table(data, colWidths=[PAGE_W - 2 * MARGIN_X - 18])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), fill),
                ("BOX", (0, 0), (-1, -1), 0.4, colors.HexColor("#b6a27e")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.append(Spacer(1, 5))
    story.append(table)
    story.append(Spacer(1, 9))


def add_plate(story, plate: dict[str, str], max_h=4.6 * INCH):
    path = IMAGE_DIR / plate["file"]
    if not path.exists():
        return
    with Image.open(path) as im:
        iw, ih = im.size
    avail_w = PAGE_W - 2 * MARGIN_X - 8
    scale = min(avail_w / iw, max_h / ih)
    img = RLImage(str(path), width=iw * scale, height=ih * scale)
    img.hAlign = "CENTER"
    story.append(Spacer(1, 6))
    story.append(img)
    story.append(p(plate["caption"], S["caption"]))


def add_chapter(story, chapter: dict):
    story.append(PageBreak())
    story.append(p(chapter["number"].upper() + "  |  " + chapter["pages"], S["chapter_number"]))
    story.append(p(chapter["title"], S["chapter"]))
    story.append(p(chapter["dek"], S["dek"]))
    add_rule(story, CLAY)
    story.append(p("The Chapter In Motion", S["h2"]))
    first = True
    for para in chapter["summary"]:
        story.append(p(para, S["body_no_indent"] if first else S["body"]))
        first = False
    add_callout(story, "Keep This", chapter["takeaway"], fill=PALE_CLAY)
    story.append(p("Subchapter Map", S["h2"]))
    story.append(bullets([f"{title}: {body}" for title, body in chapter["subsections"]], S["bullet"], OLIVE))


def build_story() -> list:
    story: list = []
    story.append(Spacer(1, 0.45 * INCH))
    story.append(p("A Reading Edition", S["smallcaps"]))
    story.append(p("The Precarious Republic", S["title"]))
    story.append(
        p(
            "A detailed chapter-by-chapter summary of Michael C. Hudson’s Political Modernization in Lebanon, built from the full scanned book.",
            S["subtitle"],
        )
    )
    add_rule(story, CLAY, 1.15)
    story.append(Spacer(1, 0.18 * INCH))
    story.append(
        p(
            "Designed as a warm, paper-grain study copy for slow reading: generous margins, short lines, archival plates, and a written structure that lets the argument gather force.",
            S["dek"],
        )
    )
    story.append(Spacer(1, 0.42 * INCH))
    add_plate(story, PLATES[0], max_h=3.6 * INCH)
    story.append(Spacer(1, 0.35 * INCH))
    story.append(p("Prepared in Beirut on June 26, 2026", S["subtitle"]))

    story.append(PageBreak())
    story.append(p("Design Research Before The Build", S["chapter"]))
    story.append(
        p(
            "Before laying out the PDF, I looked at typographic and editorial precedents so the design would serve the reading rather than merely decorate it. The central lesson was practical: a beautiful reading object begins with comfort, rhythm, hierarchy, and confidence on the page.",
            S["body_no_indent"],
        )
    )
    story.append(
        p(
            "Butterick’s typography guidance pushed the edition toward wider margins and a line length that does not tire the eye. Pentagram’s publication work suggested a steady base with restrained variation. AIGA and Behance editorial examples pointed toward tactile paper, strong opening pages, captions that behave like quiet guides, and a few meaningful plates instead of ornamental clutter. Orwell and Strunk supplied the prose discipline: concrete nouns, active verbs, fewer padded phrases, and political language that keeps responsibility visible.",
            S["body"],
        )
    )
    add_callout(
        story,
        "Design Decision",
        "The result is a compact book-like PDF on warm paper, with Georgia for long reading, Big Caslon for chapter openings, muted clay and olive accents, and selected images from the scan only where they help the reader hold the argument.",
        fill=PALE_BLUE,
    )
    story.append(p("The Whole Book In Five Movements", S["h2"]))
    story.append(bullets(ESSENCE, S["bullet"], CLAY))

    story.append(PageBreak())
    story.append(p("Contents", S["chapter"]))
    contents = [["Section", "Pages Covered"]]
    contents += [[c["number"] + ": " + c["title"], c["pages"]] for c in CHAPTERS]
    contents += [["Dramatis Personae", "People to keep in mind"], ["Timeline", "Dates to keep in mind"], ["Design and Source Notes", "Research trail"]]
    table = Table(contents, colWidths=[4.3 * INCH, 1.2 * INCH], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.2),
                ("TEXTCOLOR", (0, 0), (-1, 0), CLAY),
                ("TEXTCOLOR", (0, 1), (-1, -1), INK),
                ("LINEBELOW", (0, 0), (-1, 0), 0.5, CLAY),
                ("LINEBELOW", (0, 1), (-1, -1), 0.25, colors.HexColor("#d1c2a4")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 2),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(table)

    story.append(PageBreak())
    story.append(p("Part I", S["part"]))
    story.append(p("The Argument, Compressed", S["subtitle"]))
    story.append(Spacer(1, 0.25 * INCH))
    story.append(
        p(
            "Hudson’s book is a study of a republic that survives by bargaining with its own weaknesses. Lebanon’s sectarian balance, family politics, cabinet turnover, electoral corruption, presidential maneuvering, and loose institutions are not side details. They are the machinery. The tragedy is that machinery built to prevent civil rupture struggles to deliver social justice, planning, rural development, and a legitimate place for the newly politicized.",
            S["body_no_indent"],
        )
    )
    story.append(
        p(
            "The book keeps returning to one question in different clothes. Can Lebanon become more capable without frightening the communities whose fear is built into the state? Khoury uses the notables. Chamoun tries to dominate them. Chehab tries to work around them through administration, planning, and the army. Each strategy teaches the same lesson: the republic can adapt, but every adaptation disturbs the balance that made adaptation possible.",
            S["body"],
        )
    )
    story.append(
        p(
            "Read from Beirut in 2026, Hudson’s pre-1975 diagnosis can feel almost cruel in its accuracy. He does not know the civil war that is coming. He does not know Taif, the Israeli invasions, the Palestinian camps after 1969, the Syrian tutelage, the financial collapse, or the port explosion. But he sees the load-bearing beams already bending.",
            S["body"],
        )
    )
    add_plate(story, PLATES[1], max_h=4.5 * INCH)
    add_plate(story, PLATES[2], max_h=4.3 * INCH)

    story.append(PageBreak())
    story.append(p("Part II", S["part"]))
    story.append(p("Chapter By Chapter", S["subtitle"]))
    for chapter in CHAPTERS:
        add_chapter(story, chapter)
        if chapter["number"] == "Chapter 1":
            add_plate(story, PLATES[3], max_h=4.1 * INCH)
        if chapter["number"] == "Chapter 6":
            add_plate(story, PLATES[4], max_h=4.1 * INCH)
        if chapter["number"] == "Chapter 8":
            add_plate(story, PLATES[5], max_h=4.1 * INCH)
            add_plate(story, PLATES[6], max_h=4.1 * INCH)

    story.append(PageBreak())
    story.append(p("Part III", S["part"]))
    story.append(p("People and Dates", S["subtitle"]))
    story.append(p("Dramatis Personae", S["chapter"]))
    for name, desc in DRAMATIS:
        story.append(KeepTogether([p(name, S["h2"]), p(desc, S["body_no_indent"])]))
    story.append(PageBreak())
    story.append(p("Timeline", S["chapter"]))
    for date, desc in TIMELINE:
        data = [[p(date, S["h3"]), p(desc, S["note"])]]
        t = Table(data, colWidths=[0.75 * INCH, PAGE_W - 2 * MARGIN_X - 0.85 * INCH])
        t.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LINEBELOW", (0, 0), (-1, -1), 0.25, colors.HexColor("#d3c5a6")),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )
        story.append(t)

    story.append(PageBreak())
    story.append(p("Design and Source Notes", S["chapter"]))
    story.append(
        p(
            f"Source book: {BOOK}. The text was extracted from the full scanned PDF and split by chapter inside {ROOT}. The finished PDF is a detailed summary and interpretation, not a reproduction of the book. Image plates are limited selections from the user-provided scan, used to preserve maps, cartoons, and the material feel of the original.",
            S["body_no_indent"],
        )
    )
    story.append(p("Design and writing references used", S["h2"]))
    for item in DESIGN_RESEARCH:
        story.append(
            p(
                f"{item['source']}. {item['used']} URL: {item['url']}",
                S["note"],
            )
        )
    story.append(p("Local research files created", S["h2"]))
    story.append(
        bullets(
            [
                f"Extracted chapter text: {ROOT / 'extracted-chapters'}",
                f"Book image plates: {IMAGE_DIR}",
                f"Research dossier: {MD_OUT}",
                f"Finished reading edition: {PDF_OUT}",
            ],
            S["bullet"],
            CLAY,
        )
    )
    return story


def build_markdown() -> None:
    lines: list[str] = []
    lines.append("# The Precarious Republic, Reading Edition Research Dossier")
    lines.append("")
    lines.append(f"Source PDF: `{BOOK}`")
    lines.append(f"Finished PDF: `{PDF_OUT}`")
    lines.append(f"Extracted chapter text: `{ROOT / 'extracted-chapters'}`")
    lines.append(f"Image plates: `{IMAGE_DIR}`")
    lines.append("")
    lines.append("## Design Research")
    for item in DESIGN_RESEARCH:
        lines.append(f"- {item['source']}: {item['used']} {item['url']}")
    lines.append("")
    lines.append("## The Book In Five Movements")
    for item in ESSENCE:
        lines.append(f"- {item}")
    lines.append("")
    lines.append("## Chapter Summaries")
    for chapter in CHAPTERS:
        lines.append("")
        lines.append(f"### {chapter['number']}: {chapter['title']}")
        lines.append(f"Pages: {chapter['pages']}")
        lines.append("")
        lines.append(chapter["dek"])
        lines.append("")
        lines.append("#### The Chapter In Motion")
        for para in chapter["summary"]:
            lines.append("")
            lines.append(para)
        lines.append("")
        lines.append("#### Subchapter Map")
        for title, body in chapter["subsections"]:
            lines.append(f"- **{title}:** {body}")
        lines.append("")
        lines.append(f"**Keep this:** {chapter['takeaway']}")
    lines.append("")
    lines.append("## Dramatis Personae")
    for name, desc in DRAMATIS:
        lines.append(f"- **{name}:** {desc}")
    lines.append("")
    lines.append("## Timeline")
    for date, desc in TIMELINE:
        lines.append(f"- **{date}:** {desc}")
    lines.append("")
    lines.append("## Image Plates")
    for plate in PLATES:
        lines.append(f"- `{IMAGE_DIR / plate['file']}`: {plate['caption']}")
    lines.append("")
    MD_OUT.write_text("\n".join(lines), encoding="utf-8")


def build_pdf() -> None:
    make_texture()
    frame = Frame(
        MARGIN_X,
        MARGIN_BOTTOM,
        PAGE_W - 2 * MARGIN_X,
        PAGE_H - MARGIN_TOP - MARGIN_BOTTOM,
        id="main",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        showBoundary=0,
    )
    doc = BaseDocTemplate(
        str(PDF_OUT),
        pagesize=(PAGE_W, PAGE_H),
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=MARGIN_TOP,
        bottomMargin=MARGIN_BOTTOM,
        title="The Precarious Republic, Reading Edition",
        author="Codex for Lebanese Academic",
    )
    doc.addPageTemplates([PageTemplate(id="paper", frames=[frame], onPage=draw_background)])
    doc.build(build_story())


if __name__ == "__main__":
    build_markdown()
    build_pdf()
    print(PDF_OUT)
    print(MD_OUT)
