"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dummy data
const users = [
    { id: 1, name: "John Doe", lastMessage: "Hey there!" },
    { id: 2, name: "Alice Smith", lastMessage: "Let's talk tomorrow" },
    { id: 3, name: "Bob Johnson", lastMessage: "Meeting at 3?" },
];

export default function Messages() {
    const [selectedUser, setSelectedUser] = useState(users[0]);

    return (
        <div className="flex h-[80vh] gap-4 animate-in fade-in-50">
            {/* Left Sidebar - User List */}
            <Card className="w-full max-w-xs overflow-hidden">
                <CardHeader>
                    <CardTitle>Chats</CardTitle>
                </CardHeader>
                <ScrollArea className="h-[65vh] px-2">
                    <div className="flex flex-col gap-2">
                        {users.map((user) => (
                            <Button
                                key={user.id}
                                variant="ghost"
                                className="justify-start gap-3 py-6 w-full border-b"
                                onClick={() => setSelectedUser(user)}
                            >
                                <Avatar className="h-8 w-8 border">
                                    <AvatarImage src={""} alt={user?.name || "user"} />
                                    <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col items-start text-left">
                                    <div className="font-medium leading-none">{user.name}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                                        {user.lastMessage}
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>

            </Card>

            {/* Right Chat Window */}
            <Card className="flex-1 flex flex-col justify-between overflow-hidden">
                <CardHeader>
                    <CardTitle>Chat with {selectedUser?.name}</CardTitle>
                </CardHeader>
                <ScrollArea className="px-4 flex-1">
                    <div className="space-y-2">
                        {/* Example message thread (can be dynamic later) */}
                        <div className="text-left">You: Hello</div>
                        <div className="text-right text-muted">Them: Hi there!</div>
                    </div>
                </ScrollArea>
                <div className="flex gap-2 p-4 border-t">
                    <Input placeholder="Type a message..." />
                    <Button>Send</Button>
                </div>
            </Card>
        </div>
    );
}
