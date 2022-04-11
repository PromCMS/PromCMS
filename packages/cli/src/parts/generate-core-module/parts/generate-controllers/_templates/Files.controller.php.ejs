<?php

namespace App\Controllers;

use DI\Container;
use GuzzleHttp\Psr7\Stream;
use GuzzleHttp\Psr7\UploadedFile;
use Illuminate\Database\Capsule\Manager as DB;
use League\Flysystem\FilesystemException;
use League\Flysystem\UnableToDeleteFile;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Files
{
  private $container;
  private $fs;

  public function __construct(Container $container)
  {
    $this->container = $container;
    $this->fs = $container->get('filesystem');
  }

  public function getInfo(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $classInstance = new \Files();

    $response->getBody()->write(
      json_encode([
        'data' => $classInstance->getSummary(),
      ]),
    );

    return $response;
  }

  public function get(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    try {
      $response->getBody()->write(
        json_encode([
          'data' => \Files::where('id', $args['itemId'])
            ->get()
            ->firstOrFail(),
        ]),
      );

      return $response;
    } catch (\Exception $e) {
      return $response->withStatus(404);
    }
  }

  public function getMany(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $queryParams = $request->getQueryParams();
    $rootFromQuery = isset($queryParams['path']) ? $queryParams['path'] : '/';

    // Find files by regex with provided path. This is different logic to access something with pagination
    $finalPart = str_replace(
      '/',
      '\/',
      $rootFromQuery . ($rootFromQuery !== '/' ? '/' : ''),
    );

    $response->getBody()->write(
      json_encode([
        'data' => \Files::where(
          'filepath',
          'regexp',
          '^' . $finalPart . '[^\/]*(\.).*$',
        )->get(),
      ]),
    );

    return $response;
  }

  public function getManyListed(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $queryParams = $request->getQueryParams();
    $page = isset($queryParams["page"]) ? $queryParams["page"] : 0;

    $dataPaginated = json_decode(\Files::paginate(15, ['*'], 'page', $page)->toJson());
    // Unset some things as they are not useful or active
    unset($dataPaginated->links);
    unset($dataPaginated->first_page_url);
    unset($dataPaginated->last_page_url);
    unset($dataPaginated->next_page_url);
    unset($dataPaginated->prev_page_url);
    unset($dataPaginated->path);

    $response->getBody()->write(json_encode($dataPaginated));

    return $response;
  }

  public function getFile(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    try {
      $userId = $this->container->get('session')->get('user_id', false);
      $fileInfo = \Files::where('id', $args['itemId'])
        ->get()
        ->firstOrFail();

      if ($fileInfo->private && !$userId) {
        return $response->withStatus(401);
      }

      $file = $this->fs->readStream($fileInfo->filepath);

      $stream = new Stream($file);

      return $response
        ->withHeader('Content-Type', $this->fs->mimeType($fileInfo->filepath))
        ->withHeader('Content-Length', $this->fs->fileSize($fileInfo->filepath))
        ->withBody($stream);
    } catch (\Exception $e) {
      echo $e->getMessage();
      return $response->withStatus(404);
    }
  }

  public function create(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();
    $queryParams = $request->getQueryParams();
    $files = $request->getUploadedFiles();

    if (!count($files) || !isset($files['file'])) {
      return $response
        ->withStatus(422)
        ->withHeader('Content-Description', 'No files provided');
    }

    $data = $queryParams ? $queryParams : [];

    /**
     * @var UploadedFile
     */
    $file = $files['file'];

    // If theres an error on upload
    if ($file->getError() !== UPLOAD_ERR_OK) {
      return $response->withStatus(500);
    }

    if (!isset($data['root'])) {
      throw new \Exception('root param not provided');
    }

    $fileRoot = $data['root'];

    $extension = pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);
    $newBasename = bin2hex(random_bytes(8)) . '-' . time();

    $oldFilename = $file->getClientFilename();
    $newFilename = sprintf('%s.%0.8s', $newBasename, $extension);

    $filepath = trim(($fileRoot === '/' ? '' : $fileRoot) . '/' . $newFilename);

    try {
      DB::beginTransaction();

      $fileArgs = [
        'filepath' => $filepath,
        'filename' => $oldFilename,
      ];

      if (isset($data['description'])) {
        $fileArgs['description'] = $data['description'];
      }

      if (isset($data['private'])) {
        $fileArgs['private'] = $data['private'];
      } else {
        $fileArgs['private'] = false;
      }

      $createdFile = \Files::create($fileArgs);
      $file->moveTo(PROM_UPLOADS_ROOT . $filepath);

      DB::commit();

      $response->getBody()->write(
        json_encode([
          'data' => $createdFile,
        ]),
      );
    } catch (\Exception $e) {
      echo $e->getMessage();

      DB::rollback();

      return $response->withStatus(500);
    }

    return $response->withStatus(200);
  }

  public function update(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();

    $response->getBody()->write(
      json_encode([
        'data' => \Files::where('id', $args['itemId'])->update(
          $parsedBody['data'],
        ),
      ]),
    );

    return $response;
  }

  public function delete(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    try {
      $fileInfo = \Files::where('id', $args['itemId'])
        ->get()
        ->firstOrFail();

      try {
        $this->fs->delete($fileInfo->filepath);
      } catch (FilesystemException | UnableToDeleteFile $exception) {
        // TODO: Handle this better - db transactions?
      }

      $fileInfo->delete();

      return $response->withStatus(200);
    } catch (\Exception $e) {
      return $response->withStatus(404);
    }
  }
}