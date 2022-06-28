<?php
namespace App\Twig\Extensions;

use App\Services\FileService;
use App\Services\ImageService;
use DI\Container;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class AppExtension extends AbstractExtension
{
  private ImageService $imageService;
  private FileService $fileService;

  public function __construct(Container $container)
  {
    $this->fileService = $container->get('file-service');
    $this->imageService = $container->get('image-service');
  }

  public function getFunctions()
  {
    return [new TwigFunction('image', [$this, 'getImage'])];
  }

  public function getImage(
    string $id,
    int $width = null,
    int $height = null,
    int $quality = null
  ): array {
    $imageInfo = $this->fileService->getById($id);
    $imageResult = $this->imageService->getProcessed($imageInfo, [
      'w' => $width,
      'h' => $height,
      'q' => $quality,
    ]);

    return $imageResult;
  }
}
