<?php

namespace App\Console\Commands;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;

class ViewSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
   protected $signature = 'sessions:view';
    protected $description = 'View active sessions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sessions = DB::table('sessions')
            ->select('id', DB::raw('1 as user_id'), 'ip_address', 'last_activity')
            ->orderBy('last_activity', 'desc')
            ->limit(10)
            ->get();

        $this->table(
            ['ID', 'User ID', 'IP Address', 'Last Activity', 'Last Activity Date'],
            $sessions->map(function ($session) {
                return [
                    substr($session->id, 0, 10) . '...',
                    $session->user_id,
                    $session->ip_address,
                    $session->last_activity,
                    date('Y-m-d H:i:s', $session->last_activity),
                ];
            })
        );

        return Command::SUCCESS;
    }
}
