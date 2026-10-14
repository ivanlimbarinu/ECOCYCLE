<?php

class Response {
    public static function json($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public static function error($message, $status = 500) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit;
    }

    public static function success($data = null, $message = '', $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        $res = ['success' => true];
        if ($message) $res['message'] = $message;
        if ($data !== null) $res['data'] = $data;
        echo json_encode($res);
        exit;
    }
}
