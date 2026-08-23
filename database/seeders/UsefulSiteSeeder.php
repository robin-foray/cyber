<?php

namespace Database\Seeders;

use App\Models\UsefulSite;
use App\Models\UsefulSiteCategory;
use Illuminate\Database\Seeder;

class UsefulSiteSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            [
                'name' => 'Media Tools',
                'slug' => 'media-tools',
                'description' => 'Online editors and converters for files.',
                'sites' => [
                    ['name' => '123apps', 'slug' => '123apps', 'url' => 'https://123apps.com/', 'summary' => 'Video, audio, PDF and converter web apps.', 'icon' => 'film'],
                    ['name' => 'Photopea', 'slug' => 'photopea', 'url' => 'https://www.photopea.com/', 'summary' => 'Browser Photoshop alternative.', 'icon' => 'image'],
                    ['name' => 'Remove.bg', 'slug' => 'remove-bg', 'url' => 'https://www.remove.bg/', 'summary' => 'One-click background removal.', 'icon' => 'image'],
                ],
            ],
            [
                'name' => 'Design',
                'slug' => 'design',
                'description' => 'UI, architecture and visual design tools.',
                'sites' => [
                    ['name' => 'Blueprint', 'slug' => 'blueprint', 'url' => 'https://blueprint.am/', 'summary' => 'Architecture and blueprint planning tools.', 'icon' => 'layout'],
                    ['name' => 'Figma', 'slug' => 'figma', 'url' => 'https://www.figma.com/', 'summary' => 'Collaborative interface design.', 'icon' => 'layers'],
                    ['name' => 'Excalidraw', 'slug' => 'excalidraw', 'url' => 'https://excalidraw.com/', 'summary' => 'Whiteboard sketches for diagrams.', 'icon' => 'pen'],
                ],
            ],
            [
                'name' => 'CAD / Makers',
                'slug' => 'cad-makers',
                'description' => '3D modeling and maker platforms.',
                'sites' => [
                    ['name' => 'Tinkercad', 'slug' => 'tinkercad', 'url' => 'https://www.tinkercad.com/', 'summary' => 'Easy browser CAD for 3D and circuits.', 'icon' => 'box'],
                    ['name' => 'Onshape', 'slug' => 'onshape', 'url' => 'https://www.onshape.com/', 'summary' => 'Cloud professional CAD workspace.', 'icon' => 'box'],
                    ['name' => 'Printables', 'slug' => 'printables', 'url' => 'https://www.printables.com/', 'summary' => '3D model library for printing.', 'icon' => 'package'],
                ],
            ],
            [
                'name' => 'Dev Utils',
                'slug' => 'dev-utils',
                'description' => 'Everyday developer utilities.',
                'sites' => [
                    ['name' => 'Can I Use', 'slug' => 'caniuse', 'url' => 'https://caniuse.com/', 'summary' => 'Browser feature compatibility tables.', 'icon' => 'globe'],
                    ['name' => 'Regex101', 'slug' => 'regex101', 'url' => 'https://regex101.com/', 'summary' => 'Regex tester and debugger.', 'icon' => 'code'],
                    ['name' => 'JSON Crack', 'slug' => 'json-crack', 'url' => 'https://jsoncrack.com/', 'summary' => 'Visualize JSON as interactive graphs.', 'icon' => 'braces'],
                ],
            ],
            [
                'name' => 'GitHub Essentials',
                'slug' => 'github-essentials',
                'description' => 'Curated open-source repos every developer should bookmark.',
                'sites' => [
                    [
                        'name' => 'Public APIs',
                        'slug' => 'public-apis',
                        'url' => 'https://github.com/public-apis/public-apis',
                        'summary' => 'Huge collection of free public APIs for developers.',
                        'icon' => 'globe',
                    ],
                    [
                        'name' => 'iFixAI',
                        'slug' => 'ifixai',
                        'url' => 'https://github.com/ifixai-ai/iFixAI',
                        'summary' => 'Stress-test AI models for safety and alignment.',
                        'icon' => 'zap',
                    ],
                    [
                        'name' => 'Build Your Own X',
                        'slug' => 'build-your-own-x',
                        'url' => 'https://github.com/codecrafters-io/build-your-own-x',
                        'summary' => 'Learn programming by building real software from scratch.',
                        'icon' => 'code',
                    ],
                    [
                        'name' => 'Developer Roadmap',
                        'slug' => 'developer-roadmap',
                        'url' => 'https://github.com/kamranahmedse/developer-roadmap',
                        'summary' => 'Step-by-step roadmaps for every tech career path.',
                        'icon' => 'map',
                    ],
                    [
                        'name' => 'Free Programming Books',
                        'slug' => 'free-programming-books',
                        'url' => 'https://github.com/EbookFoundation/free-programming-books',
                        'summary' => 'Thousands of free coding books in one place.',
                        'icon' => 'book',
                    ],
                    [
                        'name' => 'System Design Primer',
                        'slug' => 'system-design-primer',
                        'url' => 'https://github.com/donnemartin/system-design-primer',
                        'summary' => 'Master system design interviews from scratch.',
                        'icon' => 'layers',
                    ],
                    [
                        'name' => 'Coding Interview University',
                        'slug' => 'coding-interview-university',
                        'url' => 'https://github.com/jwasham/coding-interview-university',
                        'summary' => 'Complete self-taught computer science roadmap.',
                        'icon' => 'graduation',
                    ],
                    [
                        'name' => 'The Art of Command Line',
                        'slug' => 'the-art-of-command-line',
                        'url' => 'https://github.com/jlevy/the-art-of-command-line',
                        'summary' => 'Become a command-line power user.',
                        'icon' => 'terminal',
                    ],
                    [
                        'name' => 'Project-Based Learning',
                        'slug' => 'project-based-learning',
                        'url' => 'https://github.com/practical-tutorials/project-based-learning',
                        'summary' => 'Learn new technologies by building projects.',
                        'icon' => 'package',
                    ],
                    [
                        'name' => "You Don't Know JS",
                        'slug' => 'you-dont-know-js',
                        'url' => 'https://github.com/getify/You-Dont-Know-JS',
                        'summary' => 'Deeply understand JavaScript beyond the basics.',
                        'icon' => 'braces',
                    ],
                    [
                        'name' => 'The Book of Secret Knowledge',
                        'slug' => 'the-book-of-secret-knowledge',
                        'url' => 'https://github.com/trimstray/the-book-of-secret-knowledge',
                        'summary' => 'Massive collection of cybersecurity and developer resources.',
                        'icon' => 'shield',
                    ],
                    [
                        'name' => 'Tech Interview Handbook',
                        'slug' => 'tech-interview-handbook',
                        'url' => 'https://github.com/yangshun/tech-interview-handbook',
                        'summary' => 'Everything you need to crack coding interviews.',
                        'icon' => 'graduation',
                    ],
                ],
            ],
        ];

        foreach ($catalog as $categoryIndex => $entry) {
            $category = UsefulSiteCategory::query()->updateOrCreate(
                ['slug' => $entry['slug']],
                [
                    'name' => $entry['name'],
                    'description' => $entry['description'],
                    'sort_order' => $categoryIndex + 1,
                ],
            );

            foreach ($entry['sites'] as $siteIndex => $site) {
                UsefulSite::query()->updateOrCreate(
                    ['slug' => $site['slug']],
                    [
                        'useful_site_category_id' => $category->id,
                        'name' => $site['name'],
                        'url' => $site['url'],
                        'summary' => $site['summary'],
                        'icon' => $site['icon'],
                        'sort_order' => $siteIndex + 1,
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
