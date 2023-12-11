import { Box, Container, Stack } from "@mui/material";
import Images from "./Slider/data";

export default function ImagesSlider() {
  return (
    <Container>
      {Images.map((item) => (
        <div key={item.id}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1}>
              <button>Update</button>
              <button>Delete</button>
            </Stack>
            <img
              src={item.src}
              alt={item.alt}
              className="img"
              style={{ width: "50%" }}
            />
          </Stack>
        </div>
      ))}
    </Container>
  );
}
