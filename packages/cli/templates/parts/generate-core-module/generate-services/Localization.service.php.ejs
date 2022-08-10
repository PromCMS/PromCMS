<?php

namespace App\Services;

use DI\Container;
use League\Flysystem\Filesystem;

class Localization
{
  private Filesystem $fs;
  private array $supportedLanguages;

  public function __construct(Container $container)
  {
    $this->container = $container;
    $this->fs = $container->get('locales-filesystem');
    $this->supportedLanguages = $this->container->get('config')['i18n'][
      'languages'
    ];
  }

  /**
   * Gets translation by file name and returns its content
   */
  function getFileContents($countryCode): array
  {
    $fileName = "/$countryCode.json";

    $stringValue = '';
    if ($this->fs->fileExists($fileName)) {
      $stringValue = $this->fs->read($fileName);
    } else {
      $defaultValue = '{}';
      $this->fs->write($fileName, $defaultValue);
      $stringValue = $defaultValue;
    }

    return json_decode($stringValue, true);
  }

  function getTranslations($countryCode)
  {
    $defaultTranslations = $this->getFileContents('default');
    $requestedTranslations = $this->getFileContents($countryCode);

    return array_merge($defaultTranslations, $requestedTranslations);
  }

  function updateTranslations($countryCode, $key, $value)
  {
    $data = $this->getFileContents($countryCode);
    $data[$key] = $value;
    $this->fs->write("/$countryCode.json", json_encode($data));
  }

  function ensureTranslation($countryCode)
  {
    if (!$countryCode) {
      return false;
    }

    $countryCode = strtolower($countryCode);
    if (!in_array($countryCode, $this->supportedLanguages)) {
      return false;
    }
    return true;
  }

  function deleteTranslationKey($key)
  {
    $countryCodes = array_merge(['default'], $this->supportedLanguages);
    foreach ($countryCodes as $countryCode) {
      $data = $this->getFileContents($countryCode);
      if (isset($data[$key])) {
        unset($data[$key]);
        $this->fs->write("/$countryCode.json", json_encode($data));
      }
    }
  }
}
