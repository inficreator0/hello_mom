import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Edit, Calendar } from "lucide-react";
import { usePosts } from "../context/PostsContext";
import PostCard from "../components/common/PostCard";

export const Profile = () => {
  const { posts, refreshPosts, isLoading } = usePosts();

  const [bio, setBio] = useState(
    "Mother of two, passionate about pregnancy health, mindful parenting, and wellness."
  );
  const [isEditingBio, setIsEditingBio] = useState(false);

  const user = {
    name: "Sarah Mom",
    avatar:
      "https://api.dicebear.com/8.x/fun-emoji/svg?seed=mother",
    joinedAt: "2024-01-10",
  };

  // Filter posts by mock ID
  const myPosts = posts.filter((p) => p.authorId === 4);
  const bookmarks = posts.filter((p) => p.bookmarked);
  const commentsCount = posts.reduce(
    (count, p) => count + (p.comments?.length || 0),
    0
  );

  useEffect(() => {
    refreshPosts();
  }, []);

  return (
    <div className="container max-w-4xl px-4 py-8 pb-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <img
          src={user.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full shadow-md"
        />

        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {user.name}
        </h1>

        <div className="flex items-center text-muted-foreground text-sm mt-1">
          <Calendar className="w-4 h-4 mr-2" />
          Joined{" "}
          {new Date(user.joinedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })}
        </div>
      </div>

      {/* BIO SECTION */}
      <Card className="mb-8 bg-card text-card-foreground">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold">About Me</h2>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditingBio(!isEditingBio)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          {isEditingBio ? (
            <textarea
              className="w-full mt-4 border bg-background rounded-md p-3 text-sm"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          ) : (
            <p className="text-sm text-muted-foreground mt-3">
              {bio}
            </p>
          )}

          {isEditingBio && (
            <div className="flex justify-end mt-4">
              <Button size="sm" onClick={() => setIsEditingBio(false)}>
                Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* USER STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Posts" value={myPosts.length} />
        <StatCard label="Comments" value={commentsCount} />
        <StatCard label="Bookmarks" value={bookmarks.length} />
        <StatCard
          label="Upvotes"
          value={myPosts.reduce((sum, p) => sum + p.votes, 0)}
        />
      </div>

      {/* Recent Posts */}
      <h2 className="text-lg font-semibold mb-3">My Recent Posts</h2>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading posts...</p>
          </CardContent>
        </Card>
      ) : myPosts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven't posted anything yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              formatDate={(d) =>
                new Date(d).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              onEdit={() => {}}
              onDelete={() => {}}
              onVote={() => {}}
              onBookmark={() => {}}
              onComment={() => {}}
              onReply={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};


const StatCard = ({ label, value }: { label: string; value: number }) => (
  <Card className="bg-card text-card-foreground">
    <CardContent className="pt-6 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-foreground">{value}</p>
    </CardContent>
  </Card>
);
