interface IUpdatable<UpdateDto> {
  update(updateDto: UpdateDto): void;
}