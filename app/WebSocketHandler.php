<?php

namespace App;

use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;
use App\Events\SearchForOpponent;

class WebSocketHandler implements MessageComponentInterface
{

    public function onOpen(ConnectionInterface $connection)
    {
        $connection->socketId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));
        $connection->app = new \stdClass();
        $connection->app->id = 'my_super_id';

        // debug_print_backtrace();

        // $this->clients->attach($connection);

        // Should i use go'o?
        // $this
        //     ->verifyAppKey($connection)
        //     ->generateSocketId($connection)
        //     ->establishConnection($connection);
    }

    public function onClose(ConnectionInterface $connection)
    {
        // Do i need to do go'o?
        // $this->channelManager->removeFromAllChannels($connection);
    }

    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        // TODO: Implement onError() method.
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {
        $data = json_decode($msg->getPayload());
        if ($data->event == "SearchForOpponent") {
            echo "1\n";
            event(new SearchForOpponent($connection, $data->symbol));
            echo "2\n";
        } else if ($data->event == "opponentPlay") {
            $connection->send('{"sla":"sla"}');
        }

        // $connection->send(json_encode(['bomdia' => json_decode($msg->getPayload())]));
    }
}
