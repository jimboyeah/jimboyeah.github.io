<?php
date_default_timezone_set('UTC');
function getfilesize($path) {
    $size = ceil(filesize($path)) . '';
    return str_repeat(' ', 8 - strlen($size)) . $size . ' KB';
}
function printlog($status = 200) {
    $time = date('D M j H:i:s Y');
    $addr = $_SERVER['REMOTE_ADDR'];
    $port = $_SERVER['REMOTE_PORT'];
    $uri = $_SERVER['REQUEST_URI'];
    $log = sprintf("[%s] %s:%s [%s]: %s\n", $time, $addr, $port, $status, $uri);
    file_put_contents('php://stdout', $log);
}
function echo_h($t) {
    echo htmlspecialchars($t);
}
function dumpfile($path) {
    $name = htmlspecialchars(pathinfo($path, PATHINFO_BASENAME));
    echo <<<EOT
<!DOCTYPE html>
<html>
<head>
<title>{$name}</title>
<meta charset="utf-8" />
<style>
pre {
    font-size: 14px;
    width: 80em;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
}
</style>
</head>
<body>
<pre>
EOT;
echo_h(file_get_contents($path));
echo <<<EOT
</pre>
</body>
</html>
EOT;
}
// start
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = $_SERVER['DOCUMENT_ROOT'] . $uri;
if (!file_exists($path)) {
    printlog(404);
    http_response_code(404);
    return false;
}
$dump_exts = array(
    'txt', 'text', 'md', 'mdown', 'markdown', 'json',
    'c', 'cpp', 'h', 'hpp', 'm', 'mm', 'lua', 'py'
);
if (!is_dir($path)) {
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if ($ext == '' || in_array($ext, $dump_exts)) {
        printlog();
        dumpfile($path);
        return true;
    } else {
        // let server handle file
        return false;
    }
}
$this_dir = substr($_SERVER['PHP_SELF'], 0, strrpos($_SERVER['PHP_SELF'], '/') + 1);
$dir = $_SERVER['DOCUMENT_ROOT'] . $this_dir;
if (!is_dir($dir)) {
    printlog(404);
    http_response_code(404);
    return false;
}
$folder = opendir($dir);
if (!readdir($folder)) {
    printlog(404);
    http_response_code(404);
    return false;
}
$files = array();
while ($file = readdir($folder)) {
    $base = $this_dir == '/' ? '' : $this_dir;
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $path = $dir . DIRECTORY_SEPARATOR . $file;
    $filesize = getfilesize($path);
    $time = date('d-M-Y H:i:s', filemtime($path));
    $is_dir = is_dir($path);
    if (substr($file, 0, 1) == '.') continue;
    $files[] = array(
        'name' => $is_dir ? $file . '/' : $file,
        'ext' => $ext,
        'size' => $filesize,
        'time' => $time,
        'is_dir' => $is_dir
    );
}
usort($files, function($a, $b) {
    if ($a['is_dir']) {
        if ($b['is_dir']) {
            return $a['name'] < $b['name'] ? -1 : 1;
        } else {
            return -1;
        }
    }
    if ($b['is_dir']) {
        return 1;
    }
    return $a['name'] < $b['name'] ? -1 : 1;
});
$name_len = 50;
?>
<!DOCTYPE html>
<html>
<head>
<title><?php echo_h($this_dir); ?></title>
<meta charset="utf-8" />
</head>
<body>
<h1>Index of <?php echo_h($this_dir); ?></h1>
<pre>
    Last modified               Size  Name
<hr /><?php if ($this_dir != '/'): ?>
[D] <a href="..">Parent Directory</a>
<?php
endif;
foreach ($files as $file):
    $dirflag = $file['is_dir'] ? '[D]' : '   ';
    $prefix = sprintf('%s %s %s', $dirflag, $file['time'], $file['size']);
    $name = $file['name'];
?>
<?php echo $prefix; ?>  <a href="<?php echo_h($name); ?>"><?php echo_h($name); ?></a>
<?php endforeach; ?>
</pre>
</body>
</html>