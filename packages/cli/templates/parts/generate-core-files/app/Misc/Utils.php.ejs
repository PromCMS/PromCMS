<?php

use DI\Container;

class Utils
{
  private string $modelsFolderName;
  private string $controllersFolderName;

  public function __construct(Container $container)
  {
    $modulesConfig = $container->get('config')['system']['modules'];

    $this->modelsFolderName = $modulesConfig['modelsFolderName'];
    $this->controllersFolderName = $modulesConfig['controllersFolderName'];
  }

  /**
   * Autoloads models for specified module root. This is primarily used by modules.
   * @return string[]|false An array of module names or
   */
  public function autoloadModels(string $moduleRoot)
  {
    // Save previously declared classes in memory
    $classes = get_declared_classes();

    // Autoload files and save imported filepaths to an array
    $importedFilepaths = autoloadFolder("$moduleRoot/$this->modelsFolderName");

    if (!$importedFilepaths) {
      return false;
    }

    // Should have all of loaded model names in array
    $diff = array_values(array_diff(get_declared_classes(), $classes));

    return $diff;
  }

  public function autoloadControllers(string $moduleRoot)
  {
    $importedFilepaths = autoloadFolder(
      "$moduleRoot/$this->controllersFolderName",
    );
    if (!$importedFilepaths) {
      return false;
    }

    return array_map(function (string $filePath) {
      $baseName = basename($filePath, '.controller.php');
      return $baseName;
    }, $importedFilepaths);
  }
}
