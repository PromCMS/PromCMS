<?php

namespace App\Controllers;

use App\Exceptions\EntityNotFoundException;
use App\Services\EntryTypeService;
use App\Services\FileService;
use App\Services\ImageService;
use DI\Container;
use GuzzleHttp\Psr7\MimeType;
use GuzzleHttp\Psr7\Stream;
use GuzzleHttp\Psr7\UploadedFile;
use League\Flysystem\Filesystem;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Files
{
  private $container;
  private Filesystem $fs;
  private FileService $fileService;
  private ImageService $imageService;
  private $config;

  public function __construct(Container $container)
  {
    $this->container = $container;
    $this->fs = $container->get('filesystem');
    $this->fileService = $container->get('file-service');
    $this->imageService = $container->get('image-service');
    $this->config = $container->get('config');
  }

  public function getInfo(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    prepareJsonResponse($response, (array) (new \Files())->getSummary());

    return $response;
  }

  public function get(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    try {
      prepareJsonResponse(
        $response,
        $this->fileService->getById($args['itemId'])->getData(),
      );

      return $response;
    } catch (\Exception $e) {
      if ($e instanceof EntityNotFoundException) {
        return $response->withStatus(404);
      }

      throw $e;
    }
  }

  public function getMany(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $queryParams = $request->getQueryParams();
    $directoryPath = isset($queryParams['path']) ? $queryParams['path'] : '/';

    prepareJsonResponse(
      $response,
      $this->fileService->getManyByDirectory($directoryPath),
    );

    return $response;
  }

  public function getManyListed(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
    $queryParams = $request->getQueryParams();
    $page = isset($queryParams['page']) ? $queryParams['page'] : 1;
    $service = new EntryTypeService(new \Files());
    $where = [];

    if (isset($queryParams['where'])) {
      [$where] = normalizeWhereQueryParam($queryParams['where']);
    }

    $response->getBody()->write(json_encode($service->getMany($where, $page)));

    return $response;
  }

  public function getFile(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $id = $args['itemId'];
    $queryParams = $request->getQueryParams();

    try {
      $userId = $this->container->get('session')->get('user_id', false);
      $fileInfo = $this->fileService->getById($id);

      if ($fileInfo->private && !$userId) {
        return $response->withStatus(401);
      }

      if (preg_match('/image\/.*/', $fileInfo->mimeType)) {
        $imageResource = $this->imageService->getProcessed(
          $fileInfo->getData(),
          $queryParams,
        );
        $stream = new Stream($imageResource['resource']);
      } else {
        $stream = $this->fileService->getStream($fileInfo->getData());
      }

      return $response
        ->withHeader('Content-Type', $this->fs->mimeType($fileInfo->filepath))
        ->withHeader('Content-Length', $stream->getSize())
        ->withBody($stream);
    } catch (\Exception $e) {
      return $response
        ->withStatus(500)
        ->withHeader('Content-Description', $e->getMessage());
    }
  }

  public function create(
    ServerRequestInterface $request,
    ResponseInterface $response
  ): ResponseInterface {
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
      return $response
        ->withStatus(500)
        ->withHeader(
          'Content-Description',
          'Upload failed ' . $file->getError(),
        );
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
    $mimeType = MimeType::fromFilename($newFilename);

    try {
      // TODO: Transactions
      //DB::beginTransaction();

      $fileArgs = [
        'filepath' => $filepath,
        'filename' => $oldFilename,
        'mimeType' => $mimeType,
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
      $file->moveTo($this->config['fs']['uploadsPath'] . $filepath);

      //DB::commit();

      prepareJsonResponse($response, $createdFile->getData());
    } catch (\Exception $e) {
      //DB::rollback();

      return $response
        ->withStatus(500)
        ->withHeader('Content-Description', $e->getMessage());
    }

    return $response->withStatus(200);
  }

  public function update(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $parsedBody = $request->getParsedBody();

    $file = \Files::getOneById($args['itemId']);
    $file->update($parsedBody['data']);

    prepareJsonResponse($response, $file->getData());

    return $response;
  }

  public function delete(
    ServerRequestInterface $request,
    ResponseInterface $response,
    array $args
  ): ResponseInterface {
    $id = $args['itemId'];
    try {
      $this->fileService->deleteById($id);

      return $response->withStatus(200);
    } catch (\Exception $e) {
      return $response->withStatus(404);
    }
  }
}
