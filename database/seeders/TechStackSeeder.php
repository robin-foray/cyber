<?php

namespace Database\Seeders;

use App\Models\TechCategory;
use App\Models\TechStack;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TechStackSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Backend',
                'slug' => 'backend',
                'description' => 'Szerveroldali runtime, frameworkek és üzleti logika.',
                'accent' => '#ccff00',
            ],
            [
                'name' => 'Frontend',
                'slug' => 'frontend',
                'description' => 'UI réteg, komponensek és stílusok.',
                'accent' => '#7CFFB2',
            ],
            [
                'name' => 'Data',
                'slug' => 'data',
                'description' => 'Adatbázisok, cache és keresés.',
                'accent' => '#B8FF66',
            ],
            [
                'name' => 'Infra',
                'slug' => 'infra',
                'description' => 'Konténerek, szerverek és üzemeltetés.',
                'accent' => '#D4FF4A',
            ],
            [
                'name' => 'Tooling',
                'slug' => 'tooling',
                'description' => 'Build, CI/CD, verziókezelés és fejlesztői eszközök.',
                'accent' => '#9BFF57',
            ],
        ];

        $categoryIds = [];
        foreach ($categories as $index => $category) {
            $model = TechCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'accent' => $category['accent'],
                    'sort_order' => $index + 1,
                ],
            );
            $categoryIds[$category['slug']] = $model->id;
        }

        $stacks = [
            [
                'name' => 'Laravel',
                'category' => 'backend',
                'docs' => 'https://laravel.com/docs',
                'summary' => 'A legtöbb komolyabb PHP-s projektemnél ehhez nyúlok, mert gyorsan lehet vele stabil admin felületet, API-t és üzleti logikát építeni.',
                'bullets' => [
                    'Admin felületek és backend API-k',
                    'Jól kezelhető adatmodellek és migrációk',
                    'Queue, scheduler és háttérfolyamatok',
                ],
                'level' => 95,
                'sort_order' => 1,
            ],
            [
                'name' => 'PHP',
                'category' => 'backend',
                'docs' => 'https://www.php.net/manual/en/',
                'summary' => 'Backend oldalon régóta alap eszköz nálam; jól használható üzleti rendszerekhez, integrációkhoz és egyedi fejlesztésekhez.',
                'bullets' => [
                    'Szerveroldali logika és üzleti folyamatok',
                    'CLI scriptek és cron feladatok',
                    'SOAP és REST integrációk',
                ],
                'level' => 94,
                'sort_order' => 2,
            ],
            [
                'name' => 'React',
                'category' => 'frontend',
                'docs' => 'https://react.dev/',
                'summary' => 'Ahol fontos az interaktív és jól felépített felhasználói felület, ott általában Reacttel dolgozom, mert hosszú távon is átlátható marad.',
                'bullets' => [
                    'Komponens alapú frontendek',
                    'Dashboardok és admin UI-k',
                    'Jól karbantartható felületi logika',
                ],
                'level' => 93,
                'sort_order' => 3,
            ],
            [
                'name' => 'TypeScript',
                'category' => 'frontend',
                'docs' => 'https://www.typescriptlang.org/docs/',
                'summary' => 'Sokat segít abban, hogy nagyobb frontend kódbázisnál kevesebb legyen a bizonytalanság és biztonságosabb legyen a refaktorálás.',
                'bullets' => [
                    'Erősebb típusosság és kevesebb rejtett hiba',
                    'Kényelmesebb refaktorálás',
                    'Jobb fejlesztői élmény nagyobb projektnél',
                ],
                'level' => 90,
                'sort_order' => 4,
            ],
            [
                'name' => 'Vite',
                'category' => 'tooling',
                'docs' => 'https://vitejs.dev/guide/',
                'summary' => 'Szeretem, mert gyors fejlesztői környezetet ad, és nem kell feleslegesen sokat küzdeni a build folyamatokkal.',
                'bullets' => [
                    'Gyors dev server',
                    'Kényelmes HMR fejlesztés közben',
                    'Egyszerű és modern frontend build',
                ],
                'level' => 92,
                'sort_order' => 5,
            ],
            [
                'name' => 'Node.js',
                'slug' => 'nodejs',
                'category' => 'tooling',
                'docs' => 'https://nodejs.org/en/docs',
                'summary' => 'Főleg build eszközök, frontend tooling és automatizálási feladatok miatt van jelen a projektjeimben.',
                'bullets' => [
                    'Frontend toolchain alapja',
                    'CLI eszközök és automatizálás',
                    'NPM csomagkezelés',
                ],
                'level' => 86,
                'sort_order' => 6,
            ],
            [
                'name' => 'MySQL',
                'category' => 'data',
                'docs' => 'https://dev.mysql.com/doc/',
                'summary' => 'Régi bevált módszer, amely nem kedveli a milliós rekordokat.',
                'bullets' => [
                    'Relációs adatok tárolása',
                    'Indexelés és jól átlátható séma',
                    'Stabil alap tipikus CRUD rendszerekhez',
                ],
                'level' => 84,
                'sort_order' => 7,
            ],
            [
                'name' => 'PostgreSQL',
                'category' => 'data',
                'docs' => 'https://www.postgresql.org/docs/',
                'summary' => 'Ahol összetettebb adatkezelésre vagy erősebb SQL lehetőségekre van szükség, ott szívesen használok PostgreSQL-t.',
                'bullets' => [
                    'Összetettebb lekérdezésekhez is jó választás',
                    'JSONB és modernebb adatkezelési lehetőségek',
                    'Erős és megbízható relációs adatbázis',
                ],
                'level' => 88,
                'sort_order' => 8,
            ],
            [
                'name' => 'Redis',
                'category' => 'data',
                'docs' => 'https://redis.io/docs/latest/',
                'summary' => 'Ahol a sebesség számít, ott szinte mindig előkerül cache-re, queue-ra vagy valamilyen átmeneti adat tárolására.',
                'bullets' => [
                    'Gyors cache réteg',
                    'Queue és háttérfeladat kezelés',
                    'TTL-es ideiglenes adatok tárolása',
                ],
                'level' => 85,
                'sort_order' => 9,
            ],
            [
                'name' => 'Docker',
                'category' => 'infra',
                'docs' => 'https://docs.docker.com/',
                'summary' => 'Sokat segít abban, hogy a fejlesztői és szerveres környezet ne csússzon szét, és könnyebb legyen egy projektet bárhol elindítani.',
                'bullets' => [
                    'Reprodukálható környezetek',
                    'Compose alapú helyi fejlesztés',
                    'Egyszerűbb deploy és izoláció',
                ],
                'level' => 87,
                'sort_order' => 10,
            ],
            [
                'name' => 'Kubernetes',
                'category' => 'infra',
                'docs' => 'https://kubernetes.io/docs/',
                'summary' => 'Ahol már több szolgáltatásból áll össze egy rendszer, ott jól jön a skálázhatóság és az automatizált üzemeltetés.',
                'bullets' => [
                    'Konténer orkesztráció',
                    'Rolling update és service kezelés',
                    'Skálázhatóbb infrastruktúra',
                ],
                'level' => 72,
                'sort_order' => 11,
            ],
            [
                'name' => 'Git',
                'category' => 'tooling',
                'docs' => 'https://git-scm.com/doc',
                'summary' => 'Napi szinten használt alap eszköz, nélküle ma már nehéz lenne normálisan fejleszteni vagy csapatban dolgozni.',
                'bullets' => [
                    'Verziókezelés és branch alapú munka',
                    'Kód review és változáskövetés',
                    'Biztonságosabb release folyamat',
                ],
                'level' => 96,
                'sort_order' => 12,
            ],
            [
                'name' => 'Bootstrap',
                'category' => 'frontend',
                'docs' => 'https://getbootstrap.com/docs/',
                'summary' => 'Régebbi és gyorsan összerakott felületeknél sokszor előkerül, főleg amikor fontos a tempó és nem kell teljesen egyedi design.',
                'bullets' => [
                    'Gyors prototipizálás',
                    'Beépített UI elemek',
                    'Reszponzív grid rendszer',
                ],
                'level' => 78,
                'sort_order' => 13,
            ],
            [
                'name' => 'CSS',
                'category' => 'frontend',
                'docs' => 'https://developer.mozilla.org/en-US/docs/Web/CSS',
                'summary' => 'Az egyedi megjelenés alapja, és sokszor itt dől el, hogy egy felület mennyire lesz igényes vagy használható.',
                'bullets' => [
                    'Layout és vizuális struktúra',
                    'Responsive megoldások',
                    'Animációk és finomhangolás',
                ],
                'level' => 91,
                'sort_order' => 14,
            ],
            [
                'name' => 'HTML',
                'slug' => 'html5',
                'category' => 'frontend',
                'docs' => 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                'summary' => 'Alap technológia, amire minden webes felület épül; a jó szerkezet itt kezdődik.',
                'bullets' => [
                    'Szemantikus struktúra',
                    'Űrlapok és alap UI elemek',
                    'Frontendek stabil váza',
                ],
                'level' => 92,
                'sort_order' => 15,
            ],
            [
                'name' => 'jQuery',
                'category' => 'frontend',
                'docs' => 'https://api.jquery.com/',
                'summary' => 'Főleg régebbi projektekben találkozom vele, de ezeknél még mindig hasznos, ha gyorsan kell belenyúlni a meglévő kódba.',
                'bullets' => [
                    'Legacy projektek karbantartása',
                    'Gyors DOM manipuláció',
                    'Egyszerűbb interakciók kezelése',
                ],
                'level' => 70,
                'sort_order' => 16,
            ],
            [
                'name' => 'Material UI',
                'slug' => 'materialui',
                'category' => 'frontend',
                'docs' => 'https://mui.com/material-ui/getting-started/',
                'summary' => 'Reactes projektekben szeretem használni, mert gyorsan lehet vele kulturált és konzisztens kezelőfelületet összerakni.',
                'bullets' => [
                    'Kész React UI komponensek',
                    'Jól testreszabható theme rendszer',
                    'Admin és dashboard felületekhez erős alap',
                ],
                'level' => 82,
                'sort_order' => 17,
            ],
            [
                'name' => 'Tailwind CSS',
                'slug' => 'tailwindcss',
                'category' => 'frontend',
                'docs' => 'https://tailwindcss.com/docs',
                'summary' => 'Ahol gyorsan kell modern és egyedi felületet építeni, ott kifejezetten szeretem a utility alapú megközelítése miatt.',
                'bullets' => [
                    'Gyors és rugalmas UI építés',
                    'Konzisztens spacing és design',
                    'Jól illik modern frontend stackhez',
                ],
                'level' => 94,
                'sort_order' => 18,
            ],
            [
                'name' => 'Apache',
                'category' => 'infra',
                'docs' => 'https://httpd.apache.org/docs/',
                'summary' => 'Jól használható klasszikus PHP-s és többdomaines környezetekben.',
                'bullets' => [
                    'VirtualHost alapú konfigurációk',
                    'Rewrite szabályok és proxyzás',
                    'Stabil webszerver megoldás',
                ],
                'level' => 80,
                'sort_order' => 19,
            ],
            [
                'name' => 'Elasticsearch',
                'category' => 'data',
                'docs' => 'https://www.elastic.co/guide/index.html',
                'summary' => 'Ahol a sima adatbázisos keresés már kevés, ott jól jön a gyors és erős full-text keresési lehetőség.',
                'bullets' => [
                    'Full-text keresés',
                    'Nagyobb adatmennyiség gyors indexelése',
                    'Szűrés és aggregációk',
                ],
                'level' => 74,
                'sort_order' => 20,
            ],
            [
                'name' => 'Linux',
                'category' => 'infra',
                'docs' => 'https://www.kernel.org/doc/html/latest/',
                'summary' => 'A szerveres és fejlesztői környezetek nagy részében ez az alap, ezért napi szinten része a munkámnak.',
                'bullets' => [
                    'Szerverüzemeltetés és hibakeresés',
                    'Shell alapú automatizálás',
                    'Fejlesztői környezetek kezelése',
                ],
                'level' => 89,
                'sort_order' => 21,
            ],
            [
                'name' => 'Gulp',
                'category' => 'tooling',
                'docs' => 'https://gulpjs.com/docs/en/getting-started/quick-start/',
                'summary' => 'Régebbi frontend folyamatoknál találkoztam vele többet, főleg amikor asset buildet és ismétlődő feladatokat kellett automatizálni.',
                'bullets' => [
                    'Task automatizálás',
                    'Asset feldolgozás',
                    'Régebbi frontend pipeline-ok kezelése',
                ],
                'level' => 68,
                'sort_order' => 22,
            ],
            [
                'name' => 'Jenkins',
                'category' => 'tooling',
                'docs' => 'https://www.jenkins.io/doc/',
                'summary' => 'Ahol szükség van automatizált build és deploy folyamatokra, ott továbbra is hasznos és jól bevált eszköz tud lenni.',
                'bullets' => [
                    'CI/CD pipeline-ok',
                    'Automatikus build és teszt futtatás',
                    'Deploy folyamatok automatizálása',
                ],
                'level' => 76,
                'sort_order' => 23,
            ],
            [
                'name' => 'Postman',
                'category' => 'tooling',
                'docs' => 'https://learning.postman.com/docs/',
                'summary' => 'API-k tesztelésénél és integrációk ellenőrzésénél sokszor ez a leggyorsabb eszköz a kezemben.',
                'bullets' => [
                    'REST API tesztelés',
                    'Kérésgyűjtemények kezelése',
                    'Environmentek és gyors hibakeresés',
                ],
                'level' => 88,
                'sort_order' => 24,
            ],
            [
                'name' => 'Atlassian',
                'category' => 'tooling',
                'docs' => 'https://www.atlassian.com/software',
                'summary' => 'Projektkövetésnél és dokumentációnál gyakran ezek az eszközök adják a közös alapot a csapatmunkához.',
                'bullets' => [
                    'Jira alapú task kezelés',
                    'Confluence dokumentáció',
                    'Csapatmunka és folyamatkövetés',
                ],
                'level' => 77,
                'sort_order' => 25,
            ],
            [
                'name' => 'WordPress',
                'category' => 'backend',
                'docs' => 'https://developer.wordpress.org/',
                'summary' => 'Főleg meglévő rendszerek karbantartásánál és kisebb módosításoknál találkozom vele, de nem ez áll hozzám a legközelebb.',
                'bullets' => [
                    'Meglévő oldalak módosítása',
                    'Theme és plugin oldali hibajavítások',
                    'Karbantartási és kisebb fejlesztési feladatok',
                ],
                'level' => 65,
                'sort_order' => 26,
            ],
        ];

        $keepSlugs = [];

        foreach ($stacks as $stack) {
            $slug = $stack['slug'] ?? Str::slug($stack['name']);
            $keepSlugs[] = $slug;
            $iconPath = "stacks/{$slug}.svg";

            TechStack::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'tech_category_id' => $categoryIds[$stack['category']],
                    'name' => $stack['name'],
                    'signal' => Str::upper(Str::snake($slug)),
                    'summary' => $stack['summary'],
                    'bullets' => $stack['bullets'],
                    'docs_url' => $stack['docs'],
                    'icon' => $iconPath,
                    'level' => $stack['level'],
                    'sort_order' => $stack['sort_order'],
                    'is_active' => true,
                ],
            );
        }

        TechStack::query()
            ->whereNotIn('slug', $keepSlugs)
            ->update(['is_active' => false]);
    }
}
