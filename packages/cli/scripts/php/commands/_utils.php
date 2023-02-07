<?php

if (!function_exists("str_includes")) {
  function str_includes(string $toSearch, string $text)
  {
    return strpos($toSearch, $text) !== false;
  }
}

if (!function_exists('str_contains')) {
  function str_contains($haystack, $needle)
  {
    return $needle !== '' && mb_strpos($haystack, $needle) !== false;
  }
}

if (!function_exists('str_starts_with')) {
  function str_starts_with($str, $start)
  {
    return (@substr_compare($str, $start, 0, strlen($start)) == 0);
  }
}

function formatCliArguments(array $arguments)
{
  $slicedArguments = array_slice($arguments, 1);
  $result = [];

  foreach ($slicedArguments as $index => $arg) {
    if (str_contains($arg, "=")) {
      [$key, $value] = array_merge(
        explode("=", $arg),
        // A little hacky way to always have some value - in this case this is a default value (--someKey=)
        [""]
      );

      $result[substr($key, 2)] = ($value === "true" || $value === "false")
        ? $value === "true"
        : (is_numeric($value) ? intval($value) : $value);
    } else {
      if (str_starts_with($arg, "--")) {
        $result[substr($arg, 2)] = true;
      } else {
        $result[$index] = $arg;
      }
    }
  }

  return $result;
}
