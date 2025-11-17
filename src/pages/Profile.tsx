import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Edit, Calendar, Baby, Sparkles } from "lucide-react";
import PostCard from "../components/common/PostCard";
import { useAuth } from "../context/AuthContext";
import { usePostsStore } from "../store/postsStore";
import Loader from "../components/common/Loader";
import { usePreferences } from "../context/PreferencesContext";

export const Profile = () => {
  const { posts, refreshPosts, isLoading } = usePostsStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { mode, setMode, babyName, babyStage, firstTimeMom, focusAreas } =
    usePreferences();

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

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background pb-24">
      <div className="container max-w-4xl px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md"
            />

            <div>
              <h1 className="text-2xl font-bold text-foreground">
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
          </div>

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* BIO SECTION */}
      <Card className="mb-8 bg-card text-card-foreground border border-border/60 shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
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

      {/* Feature settings */}
      <Card className="mb-8 bg-card text-card-foreground border border-border/60 shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-75">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Baby features</h2>
            </div>
            <span className="text-xs rounded-full px-2 py-1 bg-muted text-muted-foreground">
              {mode === "baby" ? "Enabled" : "Disabled"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Control whether baby-focused trackers and tools are highlighted in your app.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === "baby" ? "default" : "outline"}
              onClick={() => setMode("baby")}
            >
              Enable baby mode
            </Button>
            <Button
              size="sm"
              variant={mode === "community" ? "default" : "outline"}
              onClick={() => setMode("community")}
            >
              Community only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Baby info (if available) */}
      {mode === "baby" && (babyName || babyStage || firstTimeMom || (focusAreas && focusAreas.length > 0)) && (
        <Card className="mb-8 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/30 shadow-md animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-100">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Baby profile</h2>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              We use this to highlight the most relevant tools and trackers for you.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {babyName && (
                <div className="px-3 py-1 rounded-full bg-background/70 border border-primary/30">
                  <span className="font-medium">Name:</span> {babyName}
                </div>
              )}
              {babyStage && (
                <div className="px-3 py-1 rounded-full bg-background/70 border border-primary/30">
                  <span className="font-medium">Stage:</span>{" "}
                  {babyStage === "newborn"
                    ? "0–3 months"
                    : babyStage === "infant"
                    ? "3–12 months"
                    : babyStage === "toddler"
                    ? "1–3 years"
                    : "Pregnancy"}
                </div>
              )}
              {firstTimeMom && (
                <div className="px-3 py-1 rounded-full bg-background/70 border border-primary/30">
                  <span className="font-medium">First-time mom:</span>{" "}
                  {firstTimeMom === "yes" ? "Yes" : "No"}
                </div>
              )}
            </div>
            {focusAreas && focusAreas.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Current focus areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/30"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
          <CardContent className="pt-4">
            <Loader label="Loading your posts..." />
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
