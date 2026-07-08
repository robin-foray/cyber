<?php

namespace Tests\Feature\DevTools;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QrGeneratorTest extends TestCase
{
    public function test_guests_can_visit_qr_generator_page(): void
    {
        $this->get(route('dev-tools.qr-generator'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dev-tools/qr-generator')
            );
    }

    public function test_qr_generator_route_is_named(): void
    {
        $this->assertSame(
            url('/dev-tools/qr-generator'),
            route('dev-tools.qr-generator'),
        );
    }
}
