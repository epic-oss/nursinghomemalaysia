import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, ArticleSchema } from '@/components/JsonLd'

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear()
  const baseUrl = 'https://www.nursinghomemy.com'
  const pageUrl = `${baseUrl}/guides/nursing-home-exercises-malaysia`

  return {
    title: `30 Best Nursing Home Exercises Malaysia - Fun Games & Challenges (${currentYear})`,
    description:
      "Best nursing home exercises in Malaysia. Indoor games, outdoor challenges, trust activities & problem-solving tasks. Free ideas + professional providers.",
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `30 Best Nursing Home Exercises Malaysia - Fun Games & Challenges (${currentYear})`,
      description:
        "Best nursing home exercises in Malaysia. Indoor games, outdoor challenges, trust activities & problem-solving tasks. Free ideas + professional providers.",
      type: 'article',
      url: pageUrl,
      siteName: 'Nursing Home MY',
    },
    twitter: {
      card: 'summary_large_image',
      title: `30 Best Nursing Home Exercises Malaysia - Fun Games & Challenges (${currentYear})`,
      description:
        "Best nursing home exercises in Malaysia. Indoor games, outdoor challenges, trust activities & problem-solving tasks.",
    },
  }
}

export default async function NursingHomeExercisesPage() {
  const currentYear = new Date().getFullYear()
  const baseUrl = 'https://www.nursinghomemy.com'
  const pageUrl = `${baseUrl}/guides/nursing-home-exercises-malaysia`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ArticleSchema
        title={`30 Best Nursing Home Exercises Malaysia - Fun Games & Challenges (${currentYear})`}
        description="Best nursing home exercises in Malaysia. Indoor games, outdoor challenges, trust activities & problem-solving tasks."
        publishedDate="2025-10-01"
        author="Nursing Home MY"
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Guides', url: `${baseUrl}/guides` },
          { name: 'Nursing Home Exercises Malaysia', url: pageUrl },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          {' > '}
          <Link href="/guides" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Guides
          </Link>
          {' > '}
          <span className="text-zinc-900 dark:text-zinc-50">Nursing Home Exercises</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
            30 Best Nursing Home Exercises Malaysia
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Looking for effective nursing home exercises? Whether you need quick 5-minute energizers or structured half-day programs, these exercises will strengthen your team's collaboration, communication, and trust.
          </p>
          <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-MY', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Main Content */}
        <article className="prose prose-zinc max-w-none dark:prose-invert">
          <h2>Why Nursing Home Exercises Matter</h2>

          <p><strong>Benefits of regular exercises:</strong></p>
          <ul>
            <li>Improve communication and trust</li>
            <li>Break down silos between departments</li>
            <li>Boost morale and engagement</li>
            <li>Develop problem-solving skills</li>
            <li>Create lasting team bonds</li>
          </ul>

          <p><strong>When to use exercises:</strong></p>
          <ul>
            <li>Onboarding new team members</li>
            <li>Starting meetings or workshops</li>
            <li>Team away days and retreats</li>
            <li>Breaking up long training sessions</li>
            <li>Addressing specific team challenges</li>
          </ul>

          <hr />

          <h2>Quick 5-Minute Exercises</h2>
          <p>Perfect for starting meetings or energizing tired teams.</p>

          <h3>1. Two Truths and a Lie</h3>
          <p><strong>Time:</strong> 5 minutes<br />
          <strong>Group size:</strong> Any<br />
          <strong>Setup:</strong> None needed</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Each person shares 3 statements about themselves</li>
            <li>2 truths and 1 lie</li>
            <li>Team guesses which is the lie</li>
          </ul>

          <p><strong>Why it works:</strong> Builds connections through personal sharing, encourages active listening.</p>

          <hr />

          <h3>2. Speed Networking</h3>
          <p><strong>Time:</strong> 5 minutes<br />
          <strong>Group size:</strong> 10-50<br />
          <strong>Setup:</strong> Timer</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Pair up team members</li>
            <li>Give 2 minutes to introduce themselves</li>
            <li>Rotate partners after each round</li>
            <li>Complete 2-3 rounds</li>
          </ul>

          <p><strong>Why it works:</strong> Great for cross-departmental mixing, quick rapport building.</p>

          <hr />

          <h3>3. Human Bingo</h3>
          <p><strong>Time:</strong> 5-10 minutes<br />
          <strong>Group size:</strong> 10-50<br />
          <strong>Setup:</strong> Bingo cards with facts</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Create bingo cards with items like "Has traveled to 5 countries" or "Speaks 3 languages"</li>
            <li>Team members find colleagues who match each square</li>
            <li>First to complete a line wins</li>
          </ul>

          <p><strong>Why it works:</strong> Encourages mingling, reveals commonalities.</p>

          <hr />

          <h3>4. One-Word Check-In</h3>
          <p><strong>Time:</strong> 3-5 minutes<br />
          <strong>Group size:</strong> Any<br />
          <strong>Setup:</strong> None</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Go around the room</li>
            <li>Each person shares one word describing how they feel</li>
            <li>No elaboration needed</li>
          </ul>

          <p><strong>Why it works:</strong> Quick emotional temperature check, safe sharing.</p>

          <hr />

          <h3>5. 60-Second Challenges</h3>
          <p><strong>Time:</strong> 5 minutes<br />
          <strong>Group size:</strong> Any<br />
          <strong>Setup:</strong> Simple props</p>

          <p><strong>Challenges:</strong></p>
          <ul>
            <li>Stack as many cups as possible in 60 seconds</li>
            <li>Transfer items with chopsticks</li>
            <li>Build tallest card tower</li>
            <li>Unwrap candy with one hand</li>
          </ul>

          <p><strong>Why it works:</strong> High energy, competitive fun, quick laughs.</p>

          <hr />

          <h2>10-15 Minute Exercises</h2>
          <p>Great for workshop breaks or team meetings.</p>

          <h3>6. Marshmallow Challenge</h3>
          <p><strong>Time:</strong> 15 minutes<br />
          <strong>Group size:</strong> 4-5 per team<br />
          <strong>Materials:</strong> 20 spaghetti sticks, 1 meter tape, 1 meter string, 1 marshmallow</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Build tallest freestanding structure</li>
            <li>Marshmallow must be on top</li>
            <li>Structure must stand alone for 5 seconds</li>
          </ul>

          <p><strong>Why it works:</strong> Tests collaboration, prototyping, time management under pressure.</p>

          <p><strong>Debrief questions:</strong></p>
          <ul>
            <li>How did your team organize?</li>
            <li>What would you do differently?</li>
            <li>What does this teach about planning vs doing?</li>
          </ul>

          <hr />

          <h3>7. Blind Drawing</h3>
          <p><strong>Time:</strong> 10 minutes<br />
          <strong>Group size:</strong> Pairs<br />
          <strong>Materials:</strong> Paper, pens</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>One person describes a simple shape/object</li>
            <li>Partner draws it without seeing</li>
            <li>Cannot ask questions</li>
            <li>Compare results</li>
          </ul>

          <p><strong>Why it works:</strong> Highlights communication clarity, giving/receiving instructions.</p>

          <hr />

          <h3>8. Paper Tower Challenge</h3>
          <p><strong>Time:</strong> 15 minutes<br />
          <strong>Group size:</strong> 4-6 per team<br />
          <strong>Materials:</strong> Newspapers, tape</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Build tallest tower using only newspapers and tape</li>
            <li>Must stand for 10 seconds</li>
            <li>Measure height</li>
          </ul>

          <p><strong>Why it works:</strong> Creative problem-solving, resource constraints, teamwork.</p>

          <hr />

          <h3>9. Helium Stick</h3>
          <p><strong>Time:</strong> 10 minutes<br />
          <strong>Group size:</strong> 8-15<br />
          <strong>Materials:</strong> Light stick or rod</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Team forms 2 lines facing each other</li>
            <li>Everyone extends index fingers</li>
            <li>Place stick on fingers</li>
            <li>Lower stick to ground together</li>
            <li>Stick must stay on all fingers</li>
          </ul>

          <p><strong>Why it works:</strong> Surprisingly difficult! Tests coordination, patience, collective focus.</p>

          <hr />

          <h3>10. Memory Wall</h3>
          <p><strong>Time:</strong> 15 minutes<br />
          <strong>Group size:</strong> Any<br />
          <strong>Materials:</strong> Sticky notes, pens</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Write positive team memories on sticky notes</li>
            <li>Post on wall grouped by themes</li>
            <li>Share favorites</li>
          </ul>

          <p><strong>Why it works:</strong> Reinforces shared history, celebrates wins, builds pride.</p>

          <hr />

          <h2>30-60 Minute Structured Exercises</h2>
          <p>Perfect for nursing home sessions or away days.</p>

          <h3>11. Escape Room Challenge</h3>
          <p><strong>Time:</strong> 45-60 minutes<br />
          <strong>Group size:</strong> 5-8 per room<br />
          <strong>Setup:</strong> Professional escape room or DIY</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Team solves puzzles to "escape" themed room</li>
            <li>Requires communication and collaboration</li>
            <li>Time pressure adds excitement</li>
          </ul>

          <p><strong>Why it works:</strong> Real problem-solving, natural leadership emergence, memorable experience.</p>

          <p><strong>Where to do it:</strong> <Link href="/listings">Browse escape room providers</Link></p>

          <hr />

          <h3>12. Amazing Race Format</h3>
          <p><strong>Time:</strong> 60 minutes<br />
          <strong>Group size:</strong> 20-100 (4-5 per team)<br />
          <strong>Setup:</strong> Multiple stations with challenges</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Teams race through checkpoints</li>
            <li>Complete challenges at each station</li>
            <li>Collect stamps/points</li>
            <li>First to finish wins</li>
          </ul>

          <p><strong>Station ideas:</strong></p>
          <ul>
            <li>Physical challenges</li>
            <li>Puzzles</li>
            <li>Local knowledge questions</li>
            <li>Creative tasks</li>
          </ul>

          <p><strong>Why it works:</strong> High energy, competitive, varied skills needed.</p>

          <hr />

          <h3>13. Build-a-Bridge</h3>
          <p><strong>Time:</strong> 45 minutes<br />
          <strong>Group size:</strong> 10-30 (2 teams)<br />
          <strong>Materials:</strong> Cardboard, tape, string</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Two teams work separately</li>
            <li>Each builds half a bridge</li>
            <li>Bridges must connect in middle</li>
            <li>Test with weight</li>
          </ul>

          <p><strong>Why it works:</strong> Tests planning, communication between teams, coordination.</p>

          <hr />

          <h3>14. Treasure Hunt</h3>
          <p><strong>Time:</strong> 30-45 minutes<br />
          <strong>Group size:</strong> 15-50 (3-5 per team)<br />
          <strong>Setup:</strong> Clues hidden around venue</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Teams follow clues to find treasure</li>
            <li>Clues can be riddles, challenges, or puzzles</li>
            <li>First team to treasure wins</li>
          </ul>

          <p><strong>Variation:</strong> Make clues require different skills (trivia, physical, creative)</p>

          <p><strong>Why it works:</strong> Exploration, problem-solving, team strategy.</p>

          <hr />

          <h3>15. Innovation Workshop</h3>
          <p><strong>Time:</strong> 60 minutes<br />
          <strong>Group size:</strong> 10-30<br />
          <strong>Materials:</strong> Flip charts, markers</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Present a real company challenge</li>
            <li>Teams brainstorm solutions</li>
            <li>Create quick prototypes</li>
            <li>Present ideas</li>
            <li>Team votes on best solution</li>
          </ul>

          <p><strong>Why it works:</strong> Applies teamwork to real problems, encourages creative thinking.</p>

          <hr />

          <h2>Outdoor Nursing Home Exercises</h2>
          <p>Best done at retreats or outdoor venues.</p>

          <h3>16. Human Knot</h3>
          <p><strong>Time:</strong> 10 minutes<br />
          <strong>Group size:</strong> 8-15<br />
          <strong>Setup:</strong> Open space</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Stand in circle</li>
            <li>Everyone reaches across and holds 2 random hands</li>
            <li>Untangle without letting go</li>
            <li>End in perfect circle</li>
          </ul>

          <p><strong>Why it works:</strong> Physical problem-solving, communication, laughs guaranteed.</p>

          <hr />

          <h3>17. Minefield</h3>
          <p><strong>Time:</strong> 15 minutes<br />
          <strong>Group size:</strong> Pairs<br />
          <strong>Materials:</strong> Blindfolds, obstacles (cones, balls)</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Scatter obstacles in field</li>
            <li>One person blindfolded</li>
            <li>Partner guides them through verbally</li>
            <li>Cannot touch obstacles</li>
            <li>Switch roles</li>
          </ul>

          <p><strong>Why it works:</strong> Trust building, clear communication, active listening.</p>

          <hr />

          <h3>18. River Crossing</h3>
          <p><strong>Time:</strong> 20 minutes<br />
          <strong>Group size:</strong> 8-15<br />
          <strong>Materials:</strong> Paper plates or markers</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Team must cross "river" (marked area)</li>
            <li>Limited "stepping stones" (plates)</li>
            <li>Can't touch ground</li>
            <li>If anyone touches, whole team restarts</li>
          </ul>

          <p><strong>Why it works:</strong> Strategic planning, support, careful execution.</p>

          <hr />

          <h3>19. Spider Web</h3>
          <p><strong>Time:</strong> 20 minutes<br />
          <strong>Group size:</strong> 10-20<br />
          <strong>Materials:</strong> Rope tied between trees</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Create "web" with different sized gaps</li>
            <li>Team passes through without touching rope</li>
            <li>Each gap used only once</li>
            <li>Team strategizes who goes where</li>
          </ul>

          <p><strong>Why it works:</strong> Planning, trust (lifting teammates), adaptation.</p>

          <hr />

          <h3>20. Capture the Flag</h3>
          <p><strong>Time:</strong> 30-45 minutes<br />
          <strong>Group size:</strong> 20-50 (2 teams)<br />
          <strong>Setup:</strong> Large outdoor area, 2 flags</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Teams defend their flag</li>
            <li>Attempt to capture opponent's flag</li>
            <li>Tagged players return to base</li>
            <li>First to capture wins</li>
          </ul>

          <p><strong>Why it works:</strong> Strategy, teamwork, friendly competition.</p>

          <hr />

          <h2>Trust-Building Exercises</h2>
          <p>Focus on building interpersonal trust.</p>

          <h3>21. Trust Fall</h3>
          <p><strong>Time:</strong> 15 minutes<br />
          <strong>Group size:</strong> 8-15<br />
          <strong>Setup:</strong> Safe space</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Person stands on elevated platform</li>
            <li>Falls backward into team's arms</li>
            <li>Team catches safely</li>
            <li>Everyone takes turns</li>
          </ul>

          <p><strong>Safety note:</strong> Requires proper training and supervision.</p>

          <p><strong>Why it works:</strong> Literal trust demonstration, vulnerability, support.</p>

          <hr />

          <h3>22. Willow in the Wind</h3>
          <p><strong>Time:</strong> 10 minutes<br />
          <strong>Group size:</strong> 8-12<br />
          <strong>Setup:</strong> Circle formation</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>One person stands center, eyes closed</li>
            <li>Keeps body rigid</li>
            <li>Gently sways</li>
            <li>Circle catches and passes them around</li>
          </ul>

          <p><strong>Why it works:</strong> Safe trust building, physical support metaphor.</p>

          <hr />

          <h3>23. Vulnerability Circle</h3>
          <p><strong>Time:</strong> 20 minutes<br />
          <strong>Group size:</strong> 6-12<br />
          <strong>Setup:</strong> Private quiet space</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Sit in circle</li>
            <li>Share one professional struggle or fear</li>
            <li>No advice giving, just listening</li>
            <li>Thank each person for sharing</li>
          </ul>

          <p><strong>Why it works:</strong> Builds psychological safety, shows shared humanity.</p>

          <hr />

          <h2>Problem-Solving Exercises</h2>
          <p>Develop critical thinking and collaboration.</p>

          <h3>24. Egg Drop Challenge</h3>
          <p><strong>Time:</strong> 30 minutes<br />
          <strong>Group size:</strong> 4-5 per team<br />
          <strong>Materials:</strong> Raw eggs, newspapers, tape, straws</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Build contraption to protect egg</li>
            <li>Drop from height (2nd floor)</li>
            <li>Egg must survive</li>
            <li>Test all designs</li>
          </ul>

          <p><strong>Why it works:</strong> Creative engineering, testing hypotheses, learning from failure.</p>

          <hr />

          <h3>25. Tallest Tower</h3>
          <p><strong>Time:</strong> 20 minutes<br />
          <strong>Group size:</strong> 4-6 per team<br />
          <strong>Materials:</strong> Various (straws, paper, tape, cups)</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Build tallest freestanding tower</li>
            <li>Limited materials</li>
            <li>Must stand for 10 seconds</li>
          </ul>

          <p><strong>Variations:</strong> Different materials change difficulty.</p>

          <p><strong>Why it works:</strong> Resource optimization, structural thinking, iteration.</p>

          <hr />

          <h2>Communication Exercises</h2>
          <p>Improve clarity and active listening.</p>

          <h3>26. Back-to-Back Drawing</h3>
          <p><strong>Time:</strong> 10 minutes<br />
          <strong>Group size:</strong> Pairs<br />
          <strong>Materials:</strong> Paper, pens, simple images</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Sit back-to-back</li>
            <li>One describes image</li>
            <li>Other draws without seeing</li>
            <li>Cannot ask questions</li>
            <li>Compare results</li>
          </ul>

          <p><strong>Why it works:</strong> Tests description clarity, listening precision.</p>

          <hr />

          <h3>27. Telephone Game (Professional Version)</h3>
          <p><strong>Time:</strong> 10 minutes<br />
          <strong>Group size:</strong> 8-15<br />
          <strong>Setup:</strong> Line formation</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Start with complex message</li>
            <li>Whisper to next person</li>
            <li>Pass down line</li>
            <li>Compare start vs end message</li>
          </ul>

          <p><strong>Why it works:</strong> Shows information degradation, importance of clarity.</p>

          <hr />

          <h3>28. Silent Line-Up</h3>
          <p><strong>Time:</strong> 10 minutes<br />
          <strong>Group size:</strong> 10-30<br />
          <strong>Setup:</strong> Open space</p>

          <p><strong>How it works:</strong></p>
          <ul>
            <li>Without talking, line up by:
              <ul>
                <li>Birthday (month/day)</li>
                <li>Years at company</li>
                <li>Alphabetically by middle name</li>
              </ul>
            </li>
            <li>Use only gestures</li>
            <li>Check accuracy after</li>
          </ul>

          <p><strong>Why it works:</strong> Non-verbal communication, creative problem-solving.</p>

          <hr />

          <h2>How to Choose the Right Exercise</h2>

          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">Goal</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">Recommended Exercises</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Build trust</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Trust Fall, Willow in Wind, Vulnerability Circle</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Improve communication</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Back-to-Back Drawing, Telephone Game, Blind Drawing</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Problem-solving</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Marshmallow Challenge, Egg Drop, Build-a-Bridge</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Energize team</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">60-Second Challenges, Speed Networking, Capture the Flag</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Break ice</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Two Truths and a Lie, Human Bingo, One-Word Check-In</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Team bonding</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Memory Wall, Amazing Race, Treasure Hunt</td>
              </tr>
            </tbody>
          </table>

          <hr />

          <h2>Tips for Facilitating Exercises</h2>

          <h3>Before the Exercise</h3>
          <ul>
            <li><strong>Explain clearly:</strong> Give simple instructions</li>
            <li><strong>Demonstrate if complex:</strong> Show don't just tell</li>
            <li><strong>Set time limits:</strong> Keeps energy up</li>
            <li><strong>Assign roles if needed:</strong> Timekeeper, materials manager</li>
          </ul>

          <h3>During the Exercise</h3>
          <ul>
            <li><strong>Observe don't interfere:</strong> Let teams struggle (safely)</li>
            <li><strong>Keep energy up:</strong> Encourage, cheer, play music</li>
            <li><strong>Watch for disengagement:</strong> Adjust if needed</li>
            <li><strong>Take photos:</strong> Capture moments for later sharing</li>
          </ul>

          <h3>After the Exercise (Debrief)</h3>
          <p>Essential for learning! Ask:</p>
          <ul>
            <li>What happened?</li>
            <li>How did you feel?</li>
            <li>What worked well?</li>
            <li>What would you change?</li>
            <li>How does this relate to work?</li>
          </ul>

          <p><strong>Without debrief, exercises are just games.</strong></p>

          <hr />

          <h2>Professional Facilitation vs DIY</h2>

          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">Factor</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">DIY</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">Professional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Cost</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Low (materials only)</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">RM100-300/pax</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Facilitation quality</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Depends on internal skills</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Experienced trainers</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Custom design</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Limited to found exercises</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Tailored to company goals</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Debrief depth</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Basic</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Structured, insightful</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Logistics</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">You organize</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Fully managed</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300"></td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Difficult</td>
                <td className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">Yes, with registered providers</td>
              </tr>
            </tbody>
          </table>

          <p><strong>When to hire professionals:</strong></p>
          <ul>
            <li>Large groups (50+ pax)</li>
            <li>High-stakes programs (leadership)</li>
            <li>Specific outcomes needed</li>
            <li>HRDF claims required</li>
            <li>No internal facilitation skills</li>
          </ul>

          <p><Link href="/listings">Browse nursing home providers →</Link></p>

          <hr />

          <h2>Popular Venues for Exercises in Malaysia</h2>

          <h3>Indoor Venues</h3>
          <ul>
            <li>Hotel conference rooms</li>
            <li>Community halls</li>
            <li>Indoor sports complexes</li>
            <li>Coworking event spaces</li>
          </ul>

          <h3>Outdoor Venues</h3>
          <ul>
            <li><Link href="/locations/selangor">Tadom Hill Resort, Selangor</Link></li>
            <li><Link href="/locations/pahang">Janda Baik retreats, Pahang</Link></li>
            <li>Public parks (FRIM, Broga)</li>
            <li>Beach locations (Port Dickson)</li>
          </ul>

          <p><Link href="/locations">View all locations →</Link></p>

          <hr />

          <h2>Ready to Plan Nursing Home Exercises?</h2>

          <p>Use our <Link href="/calculator">Cost Calculator</Link> to estimate budget for professional facilitation.</p>

          <div className="not-prose my-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Get Free Quotes →
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Browse Activity Providers →
            </Link>
          </div>
        </article>

        {/* Back to Guides */}
        <div className="mt-12 text-center">
          <Link
            href="/guides"
            className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to Guides
          </Link>
        </div>
      </div>
    </div>
  )
}
