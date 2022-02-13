<?php

namespace App;

use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;
use App\Events\SearchForOpponent;

$GLOBALS['MATCH_QUEUE'] = [];

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
        for ($i = 0; $i < count($GLOBALS['MATCH_QUEUE']); ++$i) {
            if ($GLOBALS['MATCH_QUEUE'][$i]['id'] == $connection->socketId) {
                array_splice($GLOBALS['MATCH_QUEUE'], $i, 1);
                return;
            }
        }
        // Do i need to do go'o?
        $this->channelManager->removeFromAllChannels($connection);
    }

    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        // TODO: Implement onError() method.
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {
        $data = json_decode($msg->getPayload());
        if ($data->event == "SearchForOpponent") {
            $userId = $connection->socketId;

            if (count($GLOBALS['MATCH_QUEUE']) == 0) {
                return array_push($GLOBALS['MATCH_QUEUE'], [
                    'connection' => $connection,
                    'id' => $connection->socketId,
                    'symbol' => $data->symbol,
                ]);
            } else if (count($GLOBALS['MATCH_QUEUE']) == 1
                       && $GLOBALS['MATCH_QUEUE'][0]['id'] == $userId) {
                return;
            }

            for ($i = 0; $i < count($GLOBALS['MATCH_QUEUE']); ++$i) {
                if ($GLOBALS['MATCH_QUEUE'][$i]['id'] != $userId) {
                    $opponent = $GLOBALS['MATCH_QUEUE'][$i];
                    array_splice($GLOBALS['MATCH_QUEUE'], $i, 1);
                    break;
                }
            }

            $firstPlayerId = rand(0, 1) ? $userId : $opponent['id'];
            $connection->send(json_encode([
                'event' => 'opponentFound',
                'opponent' => [
                    'id' => $opponent['id'],
                    'symbol' => $opponent['symbol']
                ],
                'firstPlayerId' => $firstPlayerId,
            ]));
            $opponent['connection']->send(json_encode([
                'event' => 'opponentFound',
                'opponent' => [
                    'id' => $userId,
                    'symbol' => $data->symbol
                ],
                'firstPlayerId' => $firstPlayerId,
            ]));
        } else if ($data->event == "opponentPlay") {
            $connection->send(json_encode([
                'event' => 'opponentPlay',
                'opponent' => ['id' => $connection->socketId],
                'square' => ['X' => $data->X, 'Y' => $data->Y],
            ]));
        }
    }
}
