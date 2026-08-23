<?php

namespace Tests;

use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Production often runs with config:cache (APP_ENV=production baked in),
        // which makes PreventRequestForgery skip the runningUnitTests() bypass.
        $this->withoutMiddleware(PreventRequestForgery::class);
    }
}
