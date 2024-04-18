<?php

/*
 * Copyright 2019 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START appengine_flex_helloworld_index_php]
require_once __DIR__ . '/../vendor/autoload.php';

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Factory\ResponseFactory;

// Create App
$app = AppFactory::create();

// Create a response factory
$responseFactory = new ResponseFactory();
// Add static file middleware
$app->add(new StaticFileMiddleware($responseFactory));

// Display errors
$app->addErrorMiddleware(true, true, true);

class StaticFileMiddleware
{
    private $responseFactory;

    public function __construct(ResponseFactory $responseFactory)
    {
        $this->responseFactory = $responseFactory;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $uri = $request->getUri()->getPath();

        // Adjust the base directory as needed
        $basePath = __DIR__ . '/public';
        $filename = $basePath . $uri;

        if (!file_exists($filename) || !is_file($filename)) {
            return $handler->handle($request);
        }

        // Determine MIME type based on file extension
        $mimeTypes = [
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'css' => 'text/css',
            'js' => 'application/javascript'
            // Add more MIME types as needed
        ];

        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $contentType = $mimeTypes[$extension] ?? 'application/octet-stream';

        // Read file contents
        $contents = @file_get_contents($filename);

        if ($contents === false) {
            // Failed to read file, return 404 response
            return $this->responseFactory->createResponse(404);
        }

        // Create response with file contents and appropriate headers
        $response = $this->responseFactory->createResponse();
        $response->getBody()->write($contents);
        return $response->withHeader('Content-Type', $contentType);
    }
}




$app->get('/', function (Request $request, Response $response) {
    // Assuming index.html is in the same directory as this PHP file
    $response->getBody()->write(file_get_contents(__DIR__ . '/landingpage/index.html'));
    return $response;
});

$app->get('/dashboard', function (Request $request, Response $response) {
    // Assuming dashboard_index.html is in the same directory as this PHP file
    $response->getBody()->write(file_get_contents(__DIR__ . '/dashboard/dashboard_index.html'));
    return $response;
});

$app->get('/signin', function (Request $request, Response $response) {
    // Assuming sign-in.html is in the same directory as this PHP file
    $response->getBody()->write(file_get_contents(__DIR__ . '/login_registry/sign-in.html'));
    return $response;
});

// @codeCoverageIgnoreStart
if (PHP_SAPI != 'cli') {
}
// @codeCoverageIgnoreEnd
$app->run();

return $app;
// [END appengine_flex_helloworld_index_php]