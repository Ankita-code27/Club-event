import './IconFeature.css';

export default function IconFeature({ icon: Icon, title, description }) {
  return (
    <div className="icon-feature">
      <div className="icon-feature__icon-wrap">
        <div className="icon-feature__icon">
          <Icon size={22} aria-hidden="true" />
        </div>
      </div>
      <h3 className="icon-feature__title">{title}</h3>
      <p className="icon-feature__desc">{description}</p>
    </div>
  );
}
