# Task Page Component

## Getting Started

### Prerequisites

- Node.js installed on your machine

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

install the required dependencies:

```bash
npm i
```

- Create the Database

  Open your MySQL client (e.g., MySQL Workbench, command line) and create a database named 'tasks'
  Locate your environment file (named .env) and update the DATABASE_URL with the MySQL connection information.
  `DATABASE_URL="mysql://root:@localhost:3306/tasks"`
  In this case, assuming no password is set for the root user and the database is running on the default port (3306)

```bash
npx prisma db push
```

the command is telling Prisma to use the npx runner to execute the Prisma CLI and apply any pending database migrations using the db push command. This ensures that your database structure is synchronized with your Prisma schema, reflecting any changes you've made in your data model

## 1. Define GET Function:

A GET function is defined inside the `[taskId]/route.tsx` file.

It fetches task details from the database using Prisma's findFirst method.

The fetched task details are returned in a JSON response.

```tsx
// Define the GET function for fetching task details
export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params using routeContextSchema
    const { params } = routeContextSchema.parse(context);

    // Fetch task details from the database using Prisma's findFirst method
    const task = await db.task.findFirst({
      select: {
        id: true,
        title: true,
        text: true,
        isCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        id: params.taskId,
      },
    });

    // Return a JSON response with the fetched task details
    return new Response(JSON.stringify(task));
  } catch (error) {
    // Handle validation errors using z.ZodError
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    // Handle other errors by returning a 500 Internal Server Error response
    return new Response(null, { status: 500 });
  }
}
```

## 2. Create `[task]/page.tsx` File:

A page is UI that is unique to a route.

A `[task]/page.tsx` file is created with a React component that fetches task details from the API.

The cache attribute in the fetch request is set to "no-store" to avoid caching the response.

```tsx
import { formatDate } from "@/lib/utils";
import { taskGetSchema } from "@/lib/validations/task";

const page = async ({ params }: { params: { task: string } }) => {
  // Simulate a delay of 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // Extract the 'task' parameter from the URL
  const { task } = params;

  // Fetch task details from the API
  const response = await fetch(`http://localhost:3000/api/task/${task}`, {
    method: "GET",
    // Set cache attribute to "no-store" to avoid caching the response => this is SSR
    // Set cache attribute to "force-cache" to explicitly request caching
    // This is typically used for scenarios where you want to force caching of the response => this is the SSG
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Parse the JSON response
  const data = await response.json();

  // Destructure relevant properties from the response and validate using the taskGetSchema
  const { isCompleted, text, title, updatedAt } = taskGetSchema.parse(data);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="space-y-3">
        <div className="bg-gray-200 p-4 border border-gray-300 rounded-lg w-max">
          <p className="text-gray-800">{title}</p>
        </div>
        <div className="bg-gray-600 p-4 border border-gray-300 rounded-lg relative">
          <p className="text-white">{text}</p>
          <p className="text-white">{formatDate(updatedAt)}</p>
          <p className="text-white">{isCompleted}</p>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 h-4 w-8 bg-yellow-200"></div>
      </div>
    </div>
  );
};

export default page;
```

1. create a `loading.tsx` file in the same folder

```tsx
import { Skeleton } from "@/components/ui/skeleton";
// This component represents a loading state.
// It displays a set of skeleton elements to indicate that content is being loaded.
export default function TaskLoading() {
  return (
    <div className="grid items-start gap-8">
      <div className="divide-border-200 divide-y rounded-md border">
        <div className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

# Bonus

1. Create a theme provider:

   **components/theme-provider.tsx**

   ```tsx
   import * as React from "react";
   import { ThemeProvider as NextThemesProvider } from "next-themes";
   import { type ThemeProviderProps } from "next-themes/dist/types";

   export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
     return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
   }
   ```

2. Add a mode toggle:

   **components/mode-toggle.tsx**

   ```tsx
   import * as React from "react";
   import { Moon, Sun } from "lucide-react";
   import { useTheme } from "next-themes";

   import { Button } from "@/components/ui/button";
   import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
   } from "@/components/ui/dropdown-menu";

   export function ModeToggle() {
     const { setTheme } = useTheme();

     return (
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button variant="outline" size="icon">
             <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
             <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
             <span className="sr-only">Toggle theme</span>
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
           <DropdownMenuItem onClick={() => setTheme("light")}>
             Light
           </DropdownMenuItem>
           <DropdownMenuItem onClick={() => setTheme("dark")}>
             Dark
           </DropdownMenuItem>
           <DropdownMenuItem onClick={() => setTheme("system")}>
             System
           </DropdownMenuItem>
         </DropdownMenuContent>
       </DropdownMenu>
     );
   }
   ```

3. Wrap your root layout:

By uncommenting the lines related to ThemeProvider and ModeToggle, you should be able to see the mode toggle in your navbar when the component is rendered.

**app/layout.tsx**

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* Uncomment the three lines of code below to see the mode toggle in your navbar */}
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <div className="flex min-h-screen flex-col space-y-6">
          <header className="sticky top-0 z-40 border-b bg-background">
            <div className="container flex h-16 items-center justify-between py-4">
              <MainNav />
              <div className="flex justify-center items-center space-x-2">
                {/* Uncomment the next line to include the ModeToggle component */}
                {/* <ModeToggle /> */}
              </div>
            </div>
          </header>
          <main className="flex w-full flex-1 flex-col overflow-hidden container">
            {children}
            <ModalProvider />
          </main>
        </div>
        <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
```

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
