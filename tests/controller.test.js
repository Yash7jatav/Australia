const axiosInstance = require("../lib/axios.js");

const { searchImages } = require("../controllers/dataControllers.js");

jest.mock("../lib/axios.js", () => ({
  get: jest.fn(),
}));

describe("Pictoria Assignment API Test", () => {
  test("should fetch images by query (tag)", async () => {
    const mockResponse = {
      photos: [
        {
          imageUrl:
            "https://images.unsplash.com/photo-1472396961693-142e6e269027?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHwxfHxuYXR1cmV8ZW58MHx8fHwxNzMwNDQ3NDgxfDA&ixlib=rb-4.0.3&q=80&w=400",
          description:
            "Two deer in front of Half Dome in Yosemite Valley during sunset.\n\nI spent the evening in Yosemite Valley watching the sun go down on Half Dome when a couple of deer walked toward me. I took the opportunity to take this picture of them before moving out of their way so they could walk away undisturbed. It was a very beautiful experience and one of the best sunsets I've ever witnessed.",
          altDescription: "two brown deer beside trees and mountain",
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1433086966358-54859d0ed716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHwyfHxuYXR1cmV8ZW58MHx8fHwxNzMwNDQ3NDgxfDA&ixlib=rb-4.0.3&q=80&w=400",
          description: "Bridge over a green waterfall",
          altDescription: "gray concrete bridge and waterfalls during daytime",
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHwzfHxuYXR1cmV8ZW58MHx8fHwxNzMwNDQ3NDgxfDA&ixlib=rb-4.0.3&q=80&w=400",
          description: "No description available",
          altDescription: "orange flowers",
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHw0fHxuYXR1cmV8ZW58MHx8fHwxNzMwNDQ3NDgxfDA&ixlib=rb-4.0.3&q=80&w=400",
          description:
            "One of the best spots in Yellow National Park I have visited! This spot is very famous for photographers and of course crowded, but anyway I tried to capture this shot a bit different than other photographers. So I put on the zoom lense and shot this shot.",
          altDescription: "river between mountains under white clouds",
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHw1fHxuYXR1cmV8ZW58MHx8fHwxNzMwNDQ3NDgxfDA&ixlib=rb-4.0.3&q=80&w=400",
          description:
            "You can help and support me via my description (Paypal) !\n\nInstagram : @clvmentm\nFacebook Page : www.facebook.com/CMReflections/\n\nIf you wish to buy it in full quality, email me on clementmreflections@gmail.com.",
          altDescription: "photo of pine trees",
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHw2fHxuYXR1cmV8ZW58MHx8fHwxNzMwNDQ3NDgxfDA&ixlib=rb-4.0.3&q=80&w=400",
          description: "Looking up",
          altDescription: "low angle photography of trees at daytime",
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1518495973542-4542c06a5843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHw3fHxuYXR1cmV8ZW58MHx8fHwxNzMwNDQ3NDgxfDA&ixlib=rb-4.0.3&q=80&w=400",
          description: "Finding my roots",
          altDescription: "sun light passing through green leafed tree",
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHw4fHxuYXR1cmV8ZW58MHx8fHwxNzMwNDQ3NDgxfDA&ixlib=rb-4.0.3&q=80&w=400",
          description: "Alone in the unspoilt wilderness",
          altDescription: "landscape photography of mountain hit by sun rays",
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHw5fHxuYXR1cmV8ZW58MHx8fHwxNzMwNDQ3NDgxfDA&ixlib=rb-4.0.3&q=80&w=400",
          description: "Star Night Sky Ravine",
          altDescription: "blue starry night",
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjkwMjR8MHwxfHNlYXJjaHwxMHx8bmF0dXJlfGVufDB8fHx8MTczMDQ0NzQ4MXww&ixlib=rb-4.0.3&q=80&w=400",
          description: "Taking The Scenic Route",
          altDescription: "foggy mountain summit",
        },
      ],
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const req = { query: { query: "nature" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await searchImages(req, res);

    expect(axiosInstance.get).toHaveBeenCalledWith(
      `/search/photos?query=nature`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
  });
});
