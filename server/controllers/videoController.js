import { Video } from "../models/user-model.js";
import { extractVideoId } from "../utils/extractVideoId.js";

export const uploadVideos = async (req, res) => {
  try {
    const { videos } = req.body;
    const savedVideos = [];

    for (const vid of videos) {
      const videoId = extractVideoId(vid.youtubeLink);
      if (!videoId) continue;

      const exists = await Video.findOne({ videoId });
      if (exists) continue;

      const newVideo = new Video({
        title: vid.title,
        youtubeLink: vid.youtubeLink,
        videoId,
        description: vid.description,
        postedBy: req.user?._id || null, // optional
      });

      const saved = await newVideo.save();
      savedVideos.push(saved);
    }

    res
      .status(201)
      .json({ message: "Videos uploaded successfully", data: savedVideos });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Error uploading videos" });
  }
};
