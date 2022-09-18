<?php

namespace App\Services;

use DI\Container;
use GuzzleHttp\Psr7\Stream;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemException;
use League\Flysystem\UnableToDeleteFile;

class FileService
{
  private Filesystem $fs;

  public function __construct(Container $container)
  {
    $this->fs = $container->get('filesystem');
  }

  /**
   * Get one specific file from database
   */
  public function getById(string $id, $where = [])
  {
    // TODO
    $andWhere = [];
    $orWhere = [];

    return \Files::getOneById($id);
  }

  /**
   * Get many files from defined directory
   */
  public function getManyByDirectory(string $directoryPath): array
  {
    $fixedDirectoryPath = $directoryPath . ($directoryPath !== '/' ? '/' : '');
    $regexPart = str_replace('/', '\/', $fixedDirectoryPath);

    return \Files::where([
      function ($file) use ($regexPart) {
        $pattern = '(' . $regexPart . ')[^\/]*(\.).*';
        $pattern = '/^' . $pattern . "$/m";
        return !!preg_match($pattern, $file['filepath']);
      },
    ])->getMany();
  }

  /**
   * Get file from database and return it as a GuzzleHttp Stream
   */
  public function getStreamById(string $id)
  {
    $fileInfo = $this->getById($id);

    return $this->getStream($fileInfo->getData());
  }

  /**
   * Convert file from database to a GuzzleHttp Stream
   */
  public function getStream(array $fileInfo): Stream
  {
    $file = $this->fs->readStream($fileInfo['filepath']);
    return new Stream($file);
  }

  public function deleteById(string $id)
  {
    $fileInfo = $this->getById($id);

    try {
      $this->fs->delete($fileInfo->filepath);
    } catch (FilesystemException | UnableToDeleteFile $exception) {
      // TODO: Handle this better - db transactions? Does it make sense here?
    }

    $fileInfo->delete();
  }
}
