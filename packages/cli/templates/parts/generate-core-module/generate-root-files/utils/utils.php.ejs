<?php

function normalizeWhereQueryParam($filterParam)
{
  $whereQuery = [];
  $PART_SEPARATOR = ';';
  $PIECE_SEPARATOR = '.';
  $stringToExtract = $filterParam;

  // If there is an array instead of string, happens when it was defined like this in url
  if (is_array($filterParam)) {
    $stringToExtract = implode($PART_SEPARATOR, $filterParam);
  }

  // Split by separator and attach each process
  foreach (explode($PART_SEPARATOR, $stringToExtract) as $part) {
    $pieces = explode($PIECE_SEPARATOR, $part);

    if (isset($pieces[0]) && isset($pieces[1]) && isset($pieces[2])) {
      if ($pieces[1] === 'IN') {
        $whereQuery[] = [$pieces[0], 'IN', json_decode("[$pieces[2]]")];
      } else {
        $whereQuery[] = [
          $pieces[0],
          $pieces[1],
          str_replace('/', '\/', $pieces[2]),
        ];
      }
    }
  }

  return [$whereQuery];
}

require_once __DIR__ . '/handleDuplicateEntriesError.php';
require_once __DIR__ . '/prepareJsonResponse.php';
