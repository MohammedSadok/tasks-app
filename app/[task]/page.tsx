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
