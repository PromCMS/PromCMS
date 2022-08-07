<?php

class BootstrapUtils
{
  public static function getModuleRoot(string $moduleName)
  {
    return joinPath(__DIR__, '..', '..', 'modules', $moduleName);
  }

  public static function getValidModuleNames()
  {
    return array_merge(
      ['Core'],
      // Filter out the 'Core' module from basic set
      array_filter(
        // Map that dirs to folder names
        array_map(
          function ($dir) {
            return basename($dir);
          },
          // Firstly get all the dirs from modules folder
          glob(joinPath(__DIR__, '..', '..', 'modules', '*'), GLOB_ONLYDIR),
        ),
        function ($moduleName) {
          $moduleRoot = BootstrapUtils::getModuleRoot($moduleName);

          if (!file_exists(joinPath($moduleRoot, 'module-info.json'))) {
            echo "<b>Warning </b> - Created module '$moduleName' wont be functional if you don't provide module-info.json";
            return false;
          }

          return $moduleName !== 'Core';
        },
      ),
    );
  }
}
