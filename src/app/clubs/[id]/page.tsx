import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Placeholder data
const clubData = {
  id: '1',
  name: 'Oakridge Shooters',
  description: 'A community of passionate shooters dedicated to promoting safety, skill, and sportsmanship. We host weekly matches and training sessions for all skill levels.',
  location: 'Oakridge, State',
  established: 2015,
  memberCount: 78,
  tags: ['Pistol', 'Rifle', 'Competition'],
  coverImage: 'https://placehold.co/1200x400.png',
  logo: 'https://placehold.co/150x150.png',
}

export default function ClubPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch club data based on params.id
  const club = clubData

  return (
    <div>
      <div className="relative h-48 md:h-64 w-full">
        <Image
          src={club.coverImage}
          alt={`${club.name} cover image`}
          layout="fill"
          objectFit="cover"
          data-ai-hint="shooting range"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container mx-auto -mt-16 md:-mt-24 px-4">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8">
          <div className="relative h-32 w-32 md:h-48 md:w-48 rounded-full border-4 border-background bg-card overflow-hidden">
            <Image
              src={club.logo}
              alt={`${club.name} logo`}
              layout="fill"
              objectFit="cover"
              data-ai-hint="club logo"
            />
          </div>
          <div className="flex-1 text-center md:text-left py-4">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">{club.name}</h1>
            <div className="flex justify-center md:justify-start items-center gap-4 text-muted-foreground mt-2">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {club.location}</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Est. {club.established}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {club.memberCount} Members</span>
            </div>
          </div>
          <div className="pb-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/register">Request to Join</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{club.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {club.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3"><Calendar className="h-5 w-5 mt-0.5 text-primary" /> <div><p className="font-semibold text-foreground">Weekly Steel Challenge</p><p className="text-sm">Every Saturday @ 10:00 AM</p></div></li>
                    <li className="flex items-start gap-3"><Calendar className="h-5 w-5 mt-0.5 text-primary" /> <div><p className="font-semibold text-foreground">Intro to Competition Pistol</p><p className="text-sm">Next class: June 15th</p></div></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
