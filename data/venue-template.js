const VENUE_TEMPLATE = {
  id: "unique-venue-id",
  name: "Venue Name",
  address: "123 Example St, San Francisco, CA",
  neighborhood: "Mission",
  lat: 37.7600,
  lng: -122.4200,
  tables: [
    {
      name: "Table 1",
      table_size: "7 ft",
      make: "Valley",
      cloth_color: "Green",
      review: {
        cost: {
          score: 2,
          label: "$2 per game",
          comment: "Optional cost comment.",
        },
        table_condition: {
          score: 4,
          label: "Good",
          comment: "Optional overall table condition comment.",
        },
        cloth_condition: {
          score: 4,
          label: "Good",
          comment: "Optional cloth condition comment.",
        },
        rails: {
          score: 4,
          label: "Good",
          comment: "Optional rail condition comment.",
        },
        lighting: {
          score: 4,
          label: "Good",
          comment: "Optional lighting comment.",
        },
        ball_condition: {
          score: 3,
          label: "OK",
          comment: "Optional ball condition comment.",
        },
        cue_ball: {
          score: 5,
          label: "Standard",
          comment: "Optional cue ball comment.",
        },
        obstructions: {
          score: 3,
          label: "Occasional obstruction",
          comment: "Optional obstruction comment.",
        },
        rolloff: {
          score: 5,
          label: "None",
          comment: "Optional rolloff comment.",
        },
      },
      pockets: {
        label: "Average",
        comment: "Optional pocket note. Does not affect score.",
      },
    },
  ],
  notes: "General venue notes.",
};
