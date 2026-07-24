<?php

namespace Database\Seeders;

use App\Models\Machine;
use App\Models\MachineCategory;
use Illuminate\Database\Seeder;

class MachineSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            [
                'name' => 'Workstations',
                'slug' => 'workstations',
                'description' => 'Dev and design nodes for daily operations.',
                'machines' => [
                    ['name' => 'FORAY-WS-01', 'slug' => 'foray-ws-01', 'height' => 600, 'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
                    ['name' => 'NEON-DESK-07', 'slug' => 'neon-desk-07', 'height' => 500, 'image' => 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80'],
                    ['name' => 'PIXEL-RIG-3', 'slug' => 'pixel-rig-3', 'height' => 700, 'image' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80'],
                ],
            ],
            [
                'name' => 'Rack Servers',
                'slug' => 'rack-servers',
                'description' => 'Core compute and storage chassis.',
                'machines' => [
                    ['name' => 'RACK-ALPHA', 'slug' => 'rack-alpha', 'height' => 650, 'image' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'],
                    ['name' => 'CORE-BLADE-2', 'slug' => 'core-blade-2', 'height' => 480, 'image' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=800&q=80'],
                    ['name' => 'STORAGE-VAULT', 'slug' => 'storage-vault', 'height' => 560, 'image' => 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=800&q=80'],
                ],
            ],
            [
                'name' => 'Network Nodes',
                'slug' => 'network-nodes',
                'description' => 'Routing, switching and uplink hardware.',
                'machines' => [
                    ['name' => 'EDGE-SW-12', 'slug' => 'edge-sw-12', 'height' => 420, 'image' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=800&q=80&sat=-40'],
                    ['name' => 'UPLINK-FW-01', 'slug' => 'uplink-fw-01', 'height' => 540, 'image' => 'https://images.unsplash.com/photo-1551703599-6b3e8379ee7d?auto=format&fit=crop&w=800&q=80'],
                    ['name' => 'MESH-AP-9', 'slug' => 'mesh-ap-9', 'height' => 380, 'image' => 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80'],
                ],
            ],
            [
                'name' => 'Lab Instruments',
                'slug' => 'lab-instruments',
                'description' => 'Test benches and measurement gear.',
                'machines' => [
                    ['name' => 'SCOPE-X200', 'slug' => 'scope-x200', 'height' => 520, 'image' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80'],
                    ['name' => 'BENCH-PSU-4', 'slug' => 'bench-psu-4', 'height' => 460, 'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
                    ['name' => 'PROBE-ARRAY', 'slug' => 'probe-array', 'height' => 610, 'image' => 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80'],
                ],
            ],
            [
                'name' => 'Edge Devices',
                'slug' => 'edge-devices',
                'description' => 'Portable and embedded field units.',
                'machines' => [
                    ['name' => 'FIELD-UNIT-A', 'slug' => 'field-unit-a', 'height' => 440, 'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'],
                    ['name' => 'DRONE-NODE-5', 'slug' => 'drone-node-5', 'height' => 580, 'image' => 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80'],
                    ['name' => 'SENSOR-HUB', 'slug' => 'sensor-hub', 'height' => 400, 'image' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'],
                ],
            ],
        ];

        foreach ($catalog as $categoryIndex => $entry) {
            $category = MachineCategory::query()->updateOrCreate(
                ['slug' => $entry['slug']],
                [
                    'name' => $entry['name'],
                    'description' => $entry['description'],
                    'sort_order' => $categoryIndex + 1,
                ],
            );

            foreach ($entry['machines'] as $machineIndex => $machine) {
                Machine::query()->updateOrCreate(
                    ['slug' => $machine['slug']],
                    [
                        'machine_category_id' => $category->id,
                        'name' => $machine['name'],
                        'description' => $entry['description'],
                        'image_url' => $machine['image'],
                        'url' => null,
                        'height' => $machine['height'],
                        'sort_order' => $machineIndex + 1,
                    ],
                );
            }
        }
    }
}
