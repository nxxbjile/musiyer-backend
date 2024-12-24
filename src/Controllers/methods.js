export const handleBadMethods = ((req, res, next) => {
    if (req.route) {
        // Route matched but method not allowed
        res.status(405).json({
            message: `Method ${req.method} not allowed on this route.`
        });
    } else {
        res.status(500).json({
            message:"Internal server error",
        })
    }
});
