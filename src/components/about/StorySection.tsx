import { Card, CardBody } from "@heroui/card";
import { Container } from "@/src/components/UI/Container";

interface StoryItem {
  year: number;
  title: string;
  description: string;
}

interface StorySectionProps {
  story: StoryItem[];
}

export default function StorySection({ story }: StorySectionProps) {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Our Story
        </h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary h-full" />
          {story.map((item, index) => (
            <div
              key={item.year}
              className={`flex items-center mb-12 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="w-1/2 px-4">
                <Card className="p-6 shadow-lg">
                  <CardBody>
                    <h3 className="text-xl font-semibold text-primary">
                      {item.year}
                    </h3>
                    <h4 className="text-lg font-medium mt-2">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {item.description}
                    </p>
                  </CardBody>
                </Card>
              </div>
              <div className="w-1/2" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
