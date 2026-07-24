<?php

namespace App\Http\Controllers\DevTools;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Inertia\Inertia;
use Inertia\Response;

class PhpSyntaxCheckerController extends Controller
{
    /**
     * Show the PHP syntax checker tool.
     */
    public function show(): Response
    {
        return Inertia::render('dev-tools/php-syntax-checker');
    }

    /**
     * Lint PHP source with the runtime binary.
     */
    public function lint(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50000'],
        ]);

        $code = $validated['code'];
        $lineOffset = 0;
        $code = $this->normalizePhpPayload($code, $lineOffset);
        $tempFile = tempnam(sys_get_temp_dir(), 'foray-php-lint-');

        if ($tempFile === false) {
            return response()->json([
                'valid' => false,
                'message' => 'Unable to create a temporary lint buffer.',
                'line' => null,
            ], 500);
        }

        file_put_contents($tempFile, $code);

        $result = Process::run(['php', '-l', $tempFile]);
        unlink($tempFile);

        $message = trim($result->output().$result->errorOutput());
        $line = $this->extractLineNumber($message);

        if ($line !== null && $lineOffset > 0) {
            $line = max(1, $line - $lineOffset);
        }

        return response()->json([
            'valid' => $result->successful(),
            'message' => $message === '' ? 'No syntax errors detected.' : $message,
            'line' => $line,
        ]);
    }

    private function normalizePhpPayload(string $code, int &$lineOffset = 0): string
    {
        $trimmed = ltrim($code);

        if (! str_starts_with($trimmed, '<?php') && ! str_starts_with($trimmed, '<?')) {
            $lineOffset = 1;

            return "<?php\n".$code;
        }

        return $code;
    }

    private function extractLineNumber(string $message): ?int
    {
        if (preg_match('/ on line (\d+)/', $message, $matches) === 1) {
            return (int) $matches[1];
        }

        return null;
    }
}
