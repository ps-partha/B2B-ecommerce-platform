import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Plus, SortDesc } from "lucide-react";

export default function Orders(){
    return(
        <div
            className="space-y-6 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
        >
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
                <CardHeader>
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <CardTitle>My Orders</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">
                                <SortDesc className="mr-2 h-4 w-4" />
                                Sort
                            </Button>
                            {/* <Button size="sm" className="h-8 bg-primary hover:bg-primary/90">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New orders
                            </Button> */}
                        </div>
                    </div>
                </CardHeader>
                {/* <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="group flex items-center gap-4 rounded-lg border p-4 transition-all duration-300 hover:border-primary hover:bg-muted/50"
                            >
                                <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                                    <img
                                        src={`/placeholder.svg?height=64&width=64`}
                                        alt="Product"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-medium transition-colors duration-300 group-hover:text-primary">
                                        {item % 2 === 0 ? "Gaming Account - Level 90" : "Digital Asset Bundle"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Listed on {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-primary">${80 + item * 20}</p>
                                    <Badge
                                        className={
                                            item % 3 === 0 ? "bg-yellow-500 dark:bg-yellow-700" : "bg-green-500 dark:bg-green-700"
                                        }
                                    >
                                        {item % 3 === 0 ? "Pending" : "Active"}
                                    </Badge>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full transition-all duration-300 hover:bg-primary/10"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="12" r="1" />
                                                <circle cx="12" cy="5" r="1" />
                                                <circle cx="12" cy="19" r="1" />
                                            </svg>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">Promote</DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                </CardContent> */}
            </Card>
        </div>
    )
}