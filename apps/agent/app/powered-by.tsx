const PoweredBy = () => {
	return (
		<p className="mt-2 mb-8 text-xs md:text-sm text-muted-foreground text-center">
			AI-powered recruiting assistant by{" "}
			<a
				href="https://recruut.io"
				target="_blank"
				rel="noopener noreferrer"
				className="font-medium text-primary hover:underline"
			>
				Recruut
			</a>
			.
		</p>
	);
};

export default PoweredBy;
