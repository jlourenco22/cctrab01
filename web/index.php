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

// Create App
$app = AppFactory::create();

// Display errors
$app->addErrorMiddleware(true, true, true);

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
    $app->run();
}
// @codeCoverageIgnoreEnd

return $app;
// [END appengine_flex_helloworld_index_php]